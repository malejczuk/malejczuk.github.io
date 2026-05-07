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

## Product vs Process

I used to make cell phone cameras for a living.
Phone cameras are really good and very easy to use, and they can be used for making wonderful art.

The main idea of the cell phone camera is that it removes the barrier between you and the moment.
The moment itself then becomes the product of photography.
This is great, and it is achieved by making photography a frictionless, nearly invisible process.

This is convenient and practical, but it is not romantic.
As the process is omitted, so too is the beauty inherent to it.
Critically, the beauty in process is not limited merely to process; it directly flows into the resulting art.
The Japanese understand this: that’s why they drink tea the way they do.

As for me, I bought my first analog camera in November of 2025.
It's a Pentax MX.
Don't get me wrong, I still use (and love) my cell phone camera.
But it sure is nice to shoot on film.
It's romantic and intimate and artistic.
Something about the process.

It’s not about the product, it’s about the process, and by caring about the process, the product also changes.
Quote me on that.
