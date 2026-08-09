package com.vastrada.util;

import com.vastrada.entity.*;
import com.vastrada.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class SeedDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.existsByEmail("admin@vastrada.in")) {
            return; // Seed data already initialized
        }

        // 1. CREATE USERS
        User admin = new User("admin@vastrada.in", passwordEncoder.encode("Admin@123456"), "VASTRADA Master Admin", "+91 9876543210", Role.ADMIN);
        User customer = new User("customer@vastrada.in", passwordEncoder.encode("Customer@123456"), "Aarav Sharma", "+91 9812345678", Role.CUSTOMER);
        User customer2 = new User("priya.patel@gmail.com", passwordEncoder.encode("Priya@123456"), "Priya Patel", "+91 9988776655", Role.CUSTOMER);

        userRepository.saveAll(List.of(admin, customer, customer2));

        // 2. CREATE CATEGORIES
        Category ethnic = new Category("Ethnic Wear", "ethnic-wear", "Handcrafted sarees, embroidered lehengas, and royal festive ensembles", "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80", null, true);
        Category mensRoyal = new Category("Men's Royal Wear", "mens-royal-wear", "Bespoke sherwanis, bandhgalas, and silk kurta pyjama sets", "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80", null, true);
        Category western = new Category("Modern Fusion & Western", "modern-fusion-western", "Contemporary Indo-western dresses, linen shirts, and tailored blazers", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80", null, true);
        Category jewellery = new Category("Artisanal Jewellery", "artisanal-jewellery", "Kundan, Polki, Temple, and Sterling Silver statement jewellery", "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80", null, true);
        Category footwear = new Category("Heritage Footwear", "heritage-footwear", "Handcrafted leather juttis, kolhapuris, and mojris", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80", null, true);
        Category bags = new Category("Luxury Handbags & Potlis", "luxury-handbags-potlis", "Zardozi embroidered clutch bags and handcrafted leather totes", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", null, true);

        categoryRepository.saveAll(List.of(ethnic, mensRoyal, western, jewellery, footwear, bags));

        // 3. CREATE 20+ REALISTIC PRODUCTS WITH VARIANTS & INVENTORY
        createProduct(
                "Royal Kanjeevaram Pure Silk Saree",
                "royal-kanjeevaram-pure-silk-saree",
                "VASTRADA Heritage",
                "Woven by master artisans in Kanchipuram, this pure silk saree features rich zari gold brocade weave with traditional peacock motif borders and an elaborate pallu.",
                "Zari Gold Weave, 6.3 meters including unstitched blouse piece",
                "100% Pure Kanjeevaram Silk",
                "Dry clean only. Store wrapped in muslin cloth.",
                "Ships in 2-3 business days. Free insured shipping across India.",
                new BigDecimal("24999.00"),
                new BigDecimal("19999.00"),
                ethnic,
                true, true, true, true,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
                "VST-KJN-01",
                List.of("Free Size"),
                List.of("Royal Crimson Gold", "Deep Emerald Zari"),
                List.of("#800020", "#046307")
        );

        createProduct(
                "Chanderi Silk Hand-Embroidered Anarkali Suit",
                "chanderi-silk-hand-embroidered-anarkali-suit",
                "VASTRADA Couture",
                "An elegant floor-length Anarkali crafted from diaphanous Chanderi silk, adorned with intricate Gota Patti work and paired with a silk dupatta.",
                "Floor length, flared silhouette, 3/4 sleeves, round neck with keyhole back",
                "Chanderi Silk with Cotton Silk Dupatta",
                "Dry clean only.",
                "Ships within 48 hours with complimentary garment bag.",
                new BigDecimal("14999.00"),
                new BigDecimal("11999.00"),
                ethnic,
                true, false, true, false,
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
                "VST-ANR-02",
                List.of("S", "M", "L", "XL"),
                List.of("Powder Rose", "Ivory Gold"),
                List.of("#FFB6C1", "#FFFFF0")
        );

        createProduct(
                "Zardozi Embroidered Bridal Lehenga Choli",
                "zardozi-embroidered-bridal-lehenga-choli",
                "VASTRADA Couture",
                "A regal bridal lehenga embellished with antique gold Zardozi threadwork, dabka, and pearls on rich velvet with dual net dupattas.",
                "16-kalau flared lehenga with padded choli and twin dupattas",
                "Micro Velvet & Pure Net",
                "Specialist bridal dry clean only.",
                "Delivered in a wooden keepsake trunk.",
                new BigDecimal("54999.00"),
                new BigDecimal("44999.00"),
                ethnic,
                true, true, false, true,
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80",
                "VST-LHG-03",
                List.of("S", "M", "L"),
                List.of("Maharani Red", "Royal Maroon"),
                List.of("#990000", "#4A0404")
        );

        createProduct(
                "Handcrafted Banarasi Brocade Kurta Set",
                "handcrafted-banarasi-brocade-kurta-set",
                "VASTRADA Heritage",
                "Timeless Banarasi brocade straight kurta featuring gold kadwa weave, styled with matching silk pants and an organza embroidered dupatta.",
                "Straight calf-length kurta, mandarin collar, side slits",
                "Banarasi Silk Brocade & Organza",
                "Dry clean only.",
                "Ships in 1-2 business days.",
                new BigDecimal("9999.00"),
                new BigDecimal("7999.00"),
                ethnic,
                false, true, true, false,
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
                "VST-BNR-04",
                List.of("S", "M", "L", "XL", "XXL"),
                List.of("Mustard Gold", "Midnight Blue"),
                List.of("#DAA520", "#191970")
        );

        createProduct(
                "Royal Jodhpur Silk Bandhgala Jacket",
                "royal-jodhpur-silk-bandhgala-jacket",
                "VASTRADA Menswear",
                "Bespoke Jodhpuri Bandhgala crafted from heavy raw silk, featuring antique brass heraldic buttons and a structured tailored silhouette.",
                "5-button closure, welt pockets, silk lining",
                "100% Raw Silk",
                "Dry clean only.",
                "Includes wood coat hanger and protective garment suit bag.",
                new BigDecimal("18999.00"),
                new BigDecimal("14999.00"),
                mensRoyal,
                true, true, true, true,
                "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80",
                "VST-BDG-05",
                List.of("38", "40", "42", "44"),
                List.of("Imperial Navy", "Charcoal Black"),
                List.of("#000080", "#36454F")
        );

        createProduct(
                "Embroidered Heritage Sherwani Set",
                "embroidered-heritage-sherwani-set",
                "VASTRADA Menswear",
                "Classic groom's sherwani in ivory raw silk, adorned with subtle tonal Aari embroidery and paired with an embroidered stola and churidar.",
                "Front button placket, high stand collar, slim fit churidar",
                "Raw Silk & Cotton Silk Churidar",
                "Dry clean only.",
                "Ships in 3-5 business days.",
                new BigDecimal("29999.00"),
                new BigDecimal("23999.00"),
                mensRoyal,
                true, false, true, true,
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
                "VST-SHR-06",
                List.of("38", "40", "42", "44"),
                List.of("Ivory Cream", "Royal Gold"),
                List.of("#FFFDD0", "#D4AF37")
        );

        createProduct(
                "Tussar Silk Kurta Pyjama with Nehru Jacket",
                "tussar-silk-kurta-pyjama-with-nehru-jacket",
                "VASTRADA Menswear",
                "A refined 3-piece festive ensemble featuring a Tussar silk knee-length kurta, comfortable pyjamas, and a jacquard woven Nehru vest.",
                "Kurta with side pockets, Nehru jacket with brass buttons",
                "Pure Tussar Silk",
                "Dry clean recommended.",
                "Standard express delivery available.",
                new BigDecimal("11999.00"),
                new BigDecimal("8999.00"),
                mensRoyal,
                false, true, true, false,
                "https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800&q=80",
                "VST-KRT-07",
                List.of("S", "M", "L", "XL", "XXL"),
                List.of("Sage Green", "Warm Terracotta"),
                List.of("#9DC183", "#E2725B")
        );

        createProduct(
                "Pure Pashmina Hand-Woven Kashmiri Shawl",
                "pure-pashmina-hand-woven-kashmiri-shawl",
                "VASTRADA Artisanal",
                "Authentic Ladakhi Pashmina cashmere shawl, featuring hand-woven Sozni needlework by master Kashmiri craftsmen.",
                "Dimensions: 100 cm x 200 cm",
                "100% Fine Cashmere Pashmina",
                "Dry clean only. Store in airtight wooden box.",
                "Handcrafted in Srinagar. GI Tagged Authentic Certificate included.",
                new BigDecimal("21999.00"),
                new BigDecimal("17999.00"),
                ethnic,
                true, false, false, true,
                "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=800&q=80",
                "VST-PSH-08",
                List.of("Free Size"),
                List.of("Natural Beige", "Walnut Brown"),
                List.of("#F5F5DC", "#5C4033")
        );

        createProduct(
                "Hand-Cut Kundan & Uncut Diamond Necklace Set",
                "hand-cut-kundan-uncut-diamond-necklace-set",
                "VASTRADA Fine Jewels",
                "22K gold-plated regal Kundan collar necklace with ruby glass cabochons and matching chandelier earrings with pearl drops.",
                "Adjustable dori cord closure, nickel-free skin safe plating",
                "22K Gold Plated Brass, Kundan Stones, Cultured Pearls",
                "Wipe clean with dry cloth. Keep away from perfumes and moisture.",
                "Delivered in a velvet lined jewellery storage box.",
                new BigDecimal("16999.00"),
                new BigDecimal("12999.00"),
                jewellery,
                true, true, true, true,
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
                "VST-JWL-09",
                List.of("Free Size"),
                List.of("Gold & Ruby Crimson"),
                List.of("#FFD700")
        );

        createProduct(
                "Temple Jewellery 22K Gold Plated Jhumka Earrings",
                "temple-jewellery-22k-gold-plated-jhumka-earrings",
                "VASTRADA Fine Jewels",
                "Traditional South Indian temple design jhumkas featuring Goddess Lakshmi motif, intricate filigree domes, and freshwater pearl clusters.",
                "Push back post fastening, length 7.5 cm",
                "Brass with 22K Antique Gold Plating",
                "Store in anti-tarnish pouch.",
                "Ships in 24 hours.",
                new BigDecimal("4999.00"),
                new BigDecimal("34999.00"),
                jewellery,
                false, true, true, false,
                "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80",
                "VST-JMK-10",
                List.of("Free Size"),
                List.of("Antique Temple Gold"),
                List.of("#CFB53B")
        );

        createProduct(
                "Zardozi Velvet Festive Clutch Potli Bag",
                "zardozi-velvet-festive-clutch-potli-bag",
                "VASTRADA Accessories",
                "Hand-embroidered drawstring potli bag lined with rich satin, featuring pearl bead handles and metallic tassel ties.",
                "Drawstring closure, 20 cm x 18 cm",
                "Raw Velvet & Metallic Zari",
                "Wipe clean gently with dry velvet cloth.",
                "Ships in 1-2 business days.",
                new BigDecimal("3999.00"),
                new BigDecimal("2999.00"),
                bags,
                true, false, true, false,
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
                "VST-BAG-11",
                List.of("Free Size"),
                List.of("Emerald Green", "Deep Ruby Red"),
                List.of("#006400", "#990000")
        );

        createProduct(
                "Handcrafted Leather Dabka Work Juttis",
                "handcrafted-leather-dabka-work-juttis",
                "VASTRADA Footwear",
                "Authentic Punjabi juttis crafted from genuine leather, heavily embellished with gold dabka wire embroidery and cushioned soles.",
                "Double cushioned leather footbed, flat heel",
                "100% Genuine Leather",
                "Keep dry. Wipe with leather cleaner.",
                "Shipped with shoe dust bag.",
                new BigDecimal("4499.00"),
                new BigDecimal("3299.00"),
                footwear,
                true, true, true, true,
                "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80",
                "VST-JUT-12",
                List.of("36", "37", "38", "39", "40"),
                List.of("Champagne Gold", "Rose Gold"),
                List.of("#F7E7CE", "#B76E79")
        );

        createProduct(
                "Bespoke Royal Kolhapuri Leather Mojri",
                "bespoke-royal-kolhapuri-leather-mojri",
                "VASTRADA Footwear",
                "Traditional men's Kolhapuri leather mojris handcrafted in Kolhapur with hand-braided straps and intricate stitch detail.",
                "Slip-on, flat genuine leather sole",
                "Vegetable Tanned Genuine Leather",
                "Apply oil occasionally to preserve leather soft texture.",
                "Ships in 2-3 business days.",
                new BigDecimal("4999.00"),
                new BigDecimal("3699.00"),
                footwear,
                false, true, true, false,
                "https://images.unsplash.com/photo-1560343776-97e7d202ff0e?w=800&q=80",
                "VST-MJR-13",
                List.of("40", "41", "42", "43", "44"),
                List.of("Tan Leather", "Dark Mocha"),
                List.of("#D2B48C", "#3B2F2F")
        );

        createProduct(
                "Modern Linen Fusion Asymmetric Tunic",
                "modern-linen-fusion-asymmetric-tunic",
                "VASTRADA Modern",
                "A breathable organic linen tunic shirt with asymmetric high-low hem and threadwork embroidery on cuffs.",
                "Mandarin collar, 3/4 button tab sleeves",
                "100% Pure Organic Linen",
                "Machine wash cold delicate.",
                "Ships in 24 hours.",
                new BigDecimal("5999.00"),
                new BigDecimal("4499.00"),
                western,
                false, true, false, true,
                "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80",
                "VST-TNC-14",
                List.of("S", "M", "L", "XL"),
                List.of("Olive Drab", "Pristine White"),
                List.of("#6B8E23", "#FFFFFF")
        );

        createProduct(
                "Silk Organza Embroidered Dupatta",
                "silk-organza-embroidered-dupatta",
                "VASTRADA Heritage",
                "Sheer silk organza dupatta with hand-scalloped Zari border embroidery and subtle floral motif sequins throughout.",
                "Length: 2.5 meters, Width: 1 meter",
                "Pure Silk Organza",
                "Dry clean only.",
                "Ships in 1-2 business days.",
                new BigDecimal("3499.00"),
                new BigDecimal("2499.00"),
                ethnic,
                false, false, true, false,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
                "VST-DPT-15",
                List.of("Free Size"),
                List.of("Blush Pink", "Mint Green"),
                List.of("#FFB6C1", "#98FF98")
        );

        createProduct(
                "Pure Raw Silk Tailored Blazer for Men",
                "pure-raw-silk-tailored-blazer-for-men",
                "VASTRADA Menswear",
                "Contemporary single-breasted blazer in textured raw silk with notch lapels and pocket square detailing.",
                "Slim fit, double vent back, horn buttons",
                "100% Raw Silk with Bemberg lining",
                "Dry clean only.",
                "Includes garment suit cover.",
                new BigDecimal("15999.00"),
                new BigDecimal("11999.00"),
                mensRoyal,
                true, false, true, false,
                "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80",
                "VST-BLZ-16",
                List.of("38", "40", "42", "44"),
                List.of("Royal Blue", "Beige Sand"),
                List.of("#4169E1", "#F5F5DC")
        );

        createProduct(
                "Handloom Georgette Chikankari Kurti",
                "handloom-georgette-chikankari-kurti",
                "VASTRADA Heritage",
                "Authenic Lucknowi Chikankari kurti on lightweight georgette, featuring intricate Bakhiya and Phanda stitches with matching slip.",
                "Straight fit, round neck, full transparent sleeves with slip included",
                "Faux Georgette with Cotton Inner Slip",
                "Gentle hand wash.",
                "Ships in 24 hours.",
                new BigDecimal("6999.00"),
                new BigDecimal("4999.00"),
                ethnic,
                false, true, true, true,
                "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&q=80",
                "VST-CHK-17",
                List.of("S", "M", "L", "XL", "XXL"),
                List.of("Pastel Lavender", "Sky Blue"),
                List.of("#E6E6FA", "#87CEEB")
        );

        createProduct(
                "Hand-Carved Wooden & Brass Statement Box Clutch",
                "hand-carved-wooden-brass-statement-box-clutch",
                "VASTRADA Accessories",
                "Artisan box clutch hand-carved from seasoned teak wood, featuring inlay brass filigree motifs and a detachable gold chain strap.",
                "Magnetic clasp closure, velvet interior lining",
                "Teak Wood & Brass Metal",
                "Wipe clean with dry lint-free cloth.",
                "Ships in 2 business days.",
                new BigDecimal("6499.00"),
                new BigDecimal("4799.00"),
                bags,
                true, true, false, true,
                "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
                "VST-CLT-18",
                List.of("Free Size"),
                List.of("Antique Walnut Brass"),
                List.of("#8B4513")
        );

        createProduct(
                "Oxidised 925 Silver Tribal Choker Necklace",
                "oxidised-925-silver-tribal-choker-necklace",
                "VASTRADA Fine Jewels",
                "Handcrafted oxidized sterling silver tribal choker necklace adorned with intricate ghungroo bell dangles.",
                "Adjustable cord length, tarnish resistant coating",
                "925 Sterling Silver (Oxidised Finish)",
                "Store in dry sealed pouch.",
                "Silver Hallmarked Authenticity Tag included.",
                new BigDecimal("8999.00"),
                new BigDecimal("6499.00"),
                jewellery,
                false, true, true, true,
                "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
                "VST-SLV-19",
                List.of("Free Size"),
                List.of("Oxidised Antique Silver"),
                List.of("#C0C0C0")
        );

        createProduct(
                "Hand-Block Printed Chanderi Cotton Silk Saree",
                "hand-block-printed-chanderi-cotton-silk-saree",
                "VASTRADA Heritage",
                "Traditional Bagru hand-block printed Chanderi saree crafted using eco-friendly natural vegetable dyes with zari patti border.",
                "6.3 meters with unstitched blouse piece",
                "Chanderi Cotton Silk Blend",
                "First dry clean, subsequent gentle cold water hand wash.",
                "Ships in 24 hours.",
                new BigDecimal("7999.00"),
                new BigDecimal("5999.00"),
                ethnic,
                true, false, true, false,
                "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
                "VST-BLK-20",
                List.of("Free Size"),
                List.of("Indigo Blue", "Madder Red"),
                List.of("#4B0082", "#800000")
        );

        // 4. SEED SAMPLE REVIEWS
        Product saree = productRepository.findBySlug("royal-kanjeevaram-pure-silk-saree").orElse(null);
        if (saree != null) {
            Review r1 = new Review(saree, customer, 5, "Exquisite Craftsmanship & Pure Silk!", "The saree surpassed my expectations. The zari brocade is lush, heavy, and extremely royal. Wore it to a wedding and received countless compliments!", true);
            Review r2 = new Review(saree, customer2, 5, "Authentic Kanjeevaram Quality", "Truly genuine pure silk with beautiful pallu details. Packaging was very secure and elegant.", true);
            reviewRepository.saveAll(List.of(r1, r2));

            saree.setAverageRating(5.0);
            saree.setReviewCount(2);
            productRepository.save(saree);
        }
    }

    private void createProduct(
            String name, String slug, String brand, String description, String specs, String material,
            String care, String delivery, BigDecimal basePrice, BigDecimal discountPrice, Category category,
            boolean isFeatured, boolean isNewArrival, boolean isBestSeller, boolean isTrending,
            String imageUrl, String skuPrefix, List<String> sizes, List<String> colors, List<String> hexes
    ) {
        Product p = new Product();
        p.setName(name);
        p.setSlug(slug);
        p.setBrand(brand);
        p.setDescription(description);
        p.setSpecifications(specs);
        p.setMaterial(material);
        p.setCareInstructions(care);
        p.setDeliveryInfo(delivery);
        p.setBasePrice(basePrice);
        p.setDiscountPrice(discountPrice);
        p.setCategory(category);
        p.setIsFeatured(isFeatured);
        p.setIsNewArrival(isNewArrival);
        p.setIsBestSeller(isBestSeller);
        p.setIsTrending(isTrending);
        p.setIsActive(true);
        p.setAverageRating(4.8);
        p.setReviewCount(12);

        Product savedProduct = productRepository.save(p);

        ProductImage img = new ProductImage(savedProduct, imageUrl, true, 0);
        savedProduct.getImages().add(img);

        int variantIndex = 1;
        for (String size : sizes) {
            for (int i = 0; i < colors.size(); i++) {
                String color = colors.get(i);
                String hex = (hexes != null && i < hexes.size()) ? hexes.get(i) : "#000000";
                String sku = skuPrefix + "-" + size.toUpperCase().replaceAll("\\s+", "") + "-" + (i + 1);

                ProductVariant variant = new ProductVariant(savedProduct, sku, size, color, hex, basePrice, discountPrice);
                ProductVariant savedVariant = variantRepository.save(variant);

                Inventory inventory = new Inventory(savedVariant, 25, 5);
                inventoryRepository.save(inventory);
                savedVariant.setInventory(inventory);
                savedProduct.getVariants().add(savedVariant);
            }
        }

        productRepository.save(savedProduct);
    }
}
