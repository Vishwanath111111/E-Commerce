package com.vastrada.service;

import com.vastrada.dto.ProductDTO;
import com.vastrada.entity.Category;
import com.vastrada.entity.Inventory;
import com.vastrada.entity.Product;
import com.vastrada.entity.ProductImage;
import com.vastrada.entity.ProductVariant;
import com.vastrada.exception.BadRequestException;
import com.vastrada.exception.ResourceNotFoundException;
import com.vastrada.repository.CategoryRepository;
import com.vastrada.repository.InventoryRepository;
import com.vastrada.repository.ProductRepository;
import com.vastrada.repository.ProductVariantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    public Page<ProductDTO> filterProducts(
            String categorySlug,
            String search,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Double minRating,
            String size,
            String color,
            String sortBy,
            int page,
            int sizePerPage
    ) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt"); // Default: newest
        if ("price-asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.ASC, "basePrice");
        } else if ("price-desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "basePrice");
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "averageRating");
        } else if ("popular".equalsIgnoreCase(sortBy)) {
            sort = Sort.by(Sort.Direction.DESC, "reviewCount");
        }

        Pageable pageable = PageRequest.of(page, sizePerPage, sort);
        Page<Product> productPage = productRepository.filterProducts(
                categorySlug, search, minPrice, maxPrice, minRating, size, color, pageable
        );

        return productPage.map(ProductDTO::new);
    }

    public ProductDTO getProductBySlug(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        return new ProductDTO(product);
    }

    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return new ProductDTO(product);
    }

    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrueAndIsActiveTrue().stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    public List<ProductDTO> getNewArrivals() {
        return productRepository.findByIsNewArrivalTrueAndIsActiveTrue().stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    public List<ProductDTO> getBestSellers() {
        return productRepository.findByIsBestSellerTrueAndIsActiveTrue().stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    public List<ProductDTO> getTrendingProducts() {
        return productRepository.findByIsTrendingTrueAndIsActiveTrue().stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    public List<ProductDTO> getRelatedProducts(String slug) {
        Product product = productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with slug: " + slug));
        if (product.getCategory() == null) return List.of();
        return productRepository.findTop6ByCategoryIdAndIdNotAndIsActiveTrue(product.getCategory().getId(), product.getId())
                .stream().map(ProductDTO::new).collect(Collectors.toList());
    }

    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        if (productRepository.existsBySlug(dto.getSlug())) {
            throw new BadRequestException("Product slug already exists: " + dto.getSlug());
        }

        Category category = null;
        if (dto.getCategoryId() != null) {
            category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        }

        Product product = new Product();
        product.setName(dto.getName());
        product.setSlug(dto.getSlug());
        product.setBrand(dto.getBrand() != null ? dto.getBrand() : "VASTRADA");
        product.setDescription(dto.getDescription());
        product.setSpecifications(dto.getSpecifications());
        product.setMaterial(dto.getMaterial());
        product.setCareInstructions(dto.getCareInstructions());
        product.setDeliveryInfo(dto.getDeliveryInfo());
        product.setBasePrice(dto.getBasePrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        product.setCategory(category);
        product.setIsFeatured(dto.getIsFeatured() != null ? dto.getIsFeatured() : false);
        product.setIsNewArrival(dto.getIsNewArrival() != null ? dto.getIsNewArrival() : false);
        product.setIsBestSeller(dto.getIsBestSeller() != null ? dto.getIsBestSeller() : false);
        product.setIsTrending(dto.getIsTrending() != null ? dto.getIsTrending() : false);
        product.setIsActive(dto.getIsActive() != null ? dto.getIsActive() : true);

        Product savedProduct = productRepository.save(product);

        if (dto.getImages() != null && !dto.getImages().isEmpty()) {
            for (int i = 0; i < dto.getImages().size(); i++) {
                var imgDto = dto.getImages().get(i);
                ProductImage img = new ProductImage(savedProduct, imgDto.getImageUrl(), imgDto.getIsPrimary(), i);
                savedProduct.getImages().add(img);
            }
        }

        if (dto.getVariants() != null && !dto.getVariants().isEmpty()) {
            for (var varDto : dto.getVariants()) {
                ProductVariant variant = new ProductVariant(
                        savedProduct,
                        varDto.getSku(),
                        varDto.getSize(),
                        varDto.getColor(),
                        varDto.getColorHex(),
                        varDto.getPrice() != null ? varDto.getPrice() : savedProduct.getBasePrice(),
                        varDto.getDiscountPrice() != null ? varDto.getDiscountPrice() : savedProduct.getDiscountPrice()
                );
                ProductVariant savedVariant = variantRepository.save(variant);

                int stockQty = varDto.getAvailableQuantity() != null ? varDto.getAvailableQuantity() : 20;
                Inventory inventory = new Inventory(savedVariant, stockQty, 5);
                inventoryRepository.save(inventory);
                savedVariant.setInventory(inventory);
                savedProduct.getVariants().add(savedVariant);
            }
        }

        return new ProductDTO(productRepository.save(savedProduct));
    }

    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setSpecifications(dto.getSpecifications());
        product.setMaterial(dto.getMaterial());
        product.setCareInstructions(dto.getCareInstructions());
        product.setDeliveryInfo(dto.getDeliveryInfo());
        product.setBasePrice(dto.getBasePrice());
        product.setDiscountPrice(dto.getDiscountPrice());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            product.setCategory(category);
        }

        if (dto.getIsFeatured() != null) product.setIsFeatured(dto.getIsFeatured());
        if (dto.getIsNewArrival() != null) product.setIsNewArrival(dto.getIsNewArrival());
        if (dto.getIsBestSeller() != null) product.setIsBestSeller(dto.getIsBestSeller());
        if (dto.getIsTrending() != null) product.setIsTrending(dto.getIsTrending());
        if (dto.getIsActive() != null) product.setIsActive(dto.getIsActive());

        return new ProductDTO(productRepository.save(product));
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }
}
