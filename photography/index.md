---
layout: default
title: Photography
---

# Photography

<div class="gallery-index">
  {% assign galleries = site.pages | where_exp: "item", "item.path contains 'photography/'" %}
  
  {% for gallery in galleries %}
    <!-- Skip the index page itself so it doesn't link to itself -->
    {% unless gallery.url == '/photography/' %}
      <a href="{{ gallery.url | relative_url }}" class="gallery-card">
        <div class="card-image-wrapper">
          <img src="{{ gallery.cover_image | relative_url }}" alt="{{ gallery.title }}">
        </div>
        <div class="card-info">
          <h2>{{ gallery.title }}</h2>
          {% if gallery.shot_on %}
            <p>{{ gallery.shot_on }}</p>
          {% endif %}
        </div>
      </a>
    {% endunless %}
  {% endfor %}
</div>

[See here]({{ '/writing/cellphonecameras' | relative_url }}) for my thoughts on cell phone cameras and why I also shoot on film.

