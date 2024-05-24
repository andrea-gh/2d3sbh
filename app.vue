<template>
  <div class="container">
    <h1 class="title">Ahania 2</h1>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-else-if="loading" class="loading">Loading...</div>
    <div v-else class="posts">
      <div v-for="post in posts" :key="post.id" class="post-card" :style="postCardStyle">
        <h2 class="post-title">{{ post.Title }}</h2>
        <p class="post-content">{{ post.Content }}</p>
        <img v-if="post.Cover" :src="getCoverImageUrl(post.Cover)" alt="Cover Image" class="post-cover" />
      </div>
    </div>
    <div class="footer">{{ footer }}</div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue';
import '@/assets/css/main.css'; // Ensure this is imported to use the CSS

const posts = ref([]);
const loading = ref(true);
const error = ref(null);
const footer = ref(''); 

const borderRadius = ref('');
const { $directus } = useNuxtApp();

const getCoverImageUrl = (fileId) => {
  return `${$directus.defaults.baseURL}/assets/${fileId}`;
};

const fetchBlogPosts = async () => {
  try {
    console.log('Fetching blog posts from Directus...');
    const postsResponse = await $directus.get('/items/Test_Blog_Posts');
    console.log('Blog Posts Response:', postsResponse);
    posts.value = postsResponse.data.data;
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    throw new Error('Failed to fetch blog posts');
  }
};

const fetchGlobalSettings = async () => {
  try {
    console.log('Fetching global settings from Directus...');
    const globalSettingsResponse = await $directus.get('/items/Test_Global');
    console.log('Full Global Response:', globalSettingsResponse);
    const globalSettings = globalSettingsResponse.data.data;

    // Set footer from global settings
    if (globalSettings && globalSettings.Footer) {
      footer.value = globalSettings.Footer;
    }
  } catch (err) {
    console.error('Error fetching global settings:', err);
    throw new Error('Failed to fetch global settings');
  }
};

onMounted(async () => {
  try {
    await fetchBlogPosts();
    await fetchGlobalSettings();
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
