# 🎬 FilmFusion

FilmFusion is a **movie discovery web app** powered by [The Movie Database (TMDB) API](https://www.themoviedb.org/).  
Browse trending movies, search by title, view detailed information, and watch trailers all in one place.  

🌐 **Live Demo:** [FilmFusion](https://thefilmfusion7.netlify.app/)

---

## 🚀 Features

- 🔍 **Search movies** by title  
- 📊 **Browse trending movies** (daily updates)  
- 🎥 **Watch trailers** directly in the app  
- 📑 **View detailed movie information** (ratings, release date, description, etc.)  

---

## 🔑 API Endpoints

FilmFusion uses TMDB’s REST API. Below are the endpoints used:

- **Search by Movie Title**  
https://api.themoviedb.org/3/search/movie?api_key=YOUR_API_KEY&query=SEARCH_TERM

- **Get Movie Trailer by ID**  
https://api.themoviedb.org/3/movie/{movie_id}/videos?api_key=YOUR_API_KEY

- **Get Trending Movies (Daily)**  
https://api.themoviedb.org/3/trending/all/day?api_key=YOUR_API_KEY

---

## ▶️ Embedding Trailers

Trailers are displayed using a YouTube iframe:

```html
<iframe width="560" height="315" 
src="https://www.youtube.com/embed/{YOUTUBE_VIDEO_KEY}" 
title="YouTube video player" frameborder="0" 
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
allowfullscreen>
</iframe>

https://www.youtube.com/embed/UkaWO3Azk-k
