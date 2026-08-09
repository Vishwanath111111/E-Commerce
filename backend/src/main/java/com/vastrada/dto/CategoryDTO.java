package com.vastrada.dto;

import com.vastrada.entity.Category;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class CategoryDTO {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String imageUrl;
    private Long parentId;
    private String parentName;
    private List<CategoryDTO> subCategories = new ArrayList<>();
    private Boolean isFeatured;
    private Boolean isActive;

    public CategoryDTO() {}

    public CategoryDTO(Category category) {
        if (category != null) {
            this.id = category.getId();
            this.name = category.getName();
            this.slug = category.getSlug();
            this.description = category.getDescription();
            this.imageUrl = category.getImageUrl();
            if (category.getParentCategory() != null) {
                this.parentId = category.getParentCategory().getId();
                this.parentName = category.getParentCategory().getName();
            }
            if (category.getSubCategories() != null && !category.getSubCategories().isEmpty()) {
                this.subCategories = category.getSubCategories().stream()
                        .map(CategoryDTO::new)
                        .collect(Collectors.toList());
            }
            this.isFeatured = category.getIsFeatured();
            this.isActive = category.getIsActive();
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Long getParentId() { return parentId; }
    public void setParentId(Long parentId) { this.parentId = parentId; }

    public String getParentName() { return parentName; }
    public void setParentName(String parentName) { this.parentName = parentName; }

    public List<CategoryDTO> getSubCategories() { return subCategories; }
    public void setSubCategories(List<CategoryDTO> subCategories) { this.subCategories = subCategories; }

    public Boolean getIsFeatured() { return isFeatured; }
    public void setIsFeatured(Boolean isFeatured) { this.isFeatured = isFeatured; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
