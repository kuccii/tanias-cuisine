# Remotion Video Creation Skill

This skill enables AI agents to create professional promotional videos for restaurants using Remotion and NIM integration.

## Overview

The skill provides a complete pipeline for generating video content including:
- Script generation using NIM AI models
- Voiceover narration in multiple languages
- Background music from Freesound
- Video rendering using Remotion
- Professional output for marketing and social media

## Installation

Install this skill using npm:

```bash
npm install remotion-video-creation
```

## Usage

### Basic Usage

```javascript
import remotionVideoCreation from 'remotion-video-creation';

// Create a restaurant promotional video
const videoUrl = await remotionVideoCreation.createRestaurantVideo({
  restaurantName: "Tania's Cuisine & Lounge",
  menuItems: ["Swahili Fish", "Beef Broth", "Grilled Chicken"],
  duration: 30,
  style: "professional",
  languages: ["en", "rw"]
});

console.log("Video created:", videoUrl);
```

### Advanced Usage

```javascript
import remotionVideoCreation from 'remotion-video-creation';

// Create a custom video with specific requirements
const videoUrl = await remotionVideoCreation.createRestaurantVideo({
  restaurantName: "Tania's Cuisine & Lounge",
  menuItems: ["Swahili Fish", "Beef Broth"],
  duration: 60,
  style: "creative",
  languages: ["en", "rw", "fr"]
});

// Get only scripts
const scripts = await remotionVideoCreation.generateVideoScripts(
  "Tania's Cuisine & Lounge",
  ["Swahili Fish", "Beef Broth"],
  "professional"
);
```

## Features

### Script Generation
- Uses NIM AI models to generate engaging video scripts
- Supports multiple languages (English, Kinyarwanda, etc.)
- Creates scripts tailored to restaurant style and content
- Includes cultural context and call-to-action elements

### Voiceover Narration
- Generates high-quality TTS using NIM models
- Supports multiple languages with appropriate voices
- Optimizes scripts for natural-sounding narration
- Can generate both English and Kinyarwanda narrations

### Background Music
- Searches and integrates music from Freesound
- Style-appropriate selections (professional, creative, minimal)
- Seamless audio mixing with voiceover
- High-quality audio for professional output

### Video Rendering
- Uses Remotion for professional video composition
- Creates 1920x1080 videos at 30fps
- Includes animations and transitions
- Professional output optimized for social media

## Example: Tania's Restaurant

Here's how to create a promotional video for Tania's Cuisine & Lounge:

```javascript
import remotionVideoCreation from 'remotion-video-creation';

// Create a promotional video for Tania's restaurant
const videoUrl = await remotionVideoCreation.createRestaurantVideo({
  restaurantName: "Tania's Cuisine & Lounge",
  menuItems: ["Swahili Fish", "Beef Broth", "Grilled Chicken"],
  duration: 30,
  style: "professional",
  languages: ["en", "rw"]
});

console.log("Promotional video created successfully!");
console.log("Video URL:", videoUrl);
```

## Configuration

### Environment Variables

Set the following environment variables:

```bash
NVIDIA_API_KEY=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
```

## Requirements

- Node.js 16 or higher
- npm or yarn
- NVIDIA API key (optional, uses fallback if not provided)

## Technical Details

### Script Generation
- Uses OpenAI-compatible NVIDIA NIM API
- Model: `meta/llama-3.1-70b-instruct`
- Endpoint: https://integrate.api.nvidia.com/v1/chat/completions
- Max tokens: 500

### Voice Generation
- Uses NVIDIA NIM TTS
- Model: `nvidia/tts-hifigan`
- Endpoint: https://integrate.api.nvidia.com/v1/audio/speech
- Supports multiple voices and languages

### Video Rendering
- Uses Remotion framework
- 1920x1080 resolution
- 30fps
- Supports animations and transitions

## Error Handling

The skill includes comprehensive error handling:

- **API failures**: Falls back to default content
- **Network issues**: Retries with exponential backoff
- **Invalid responses**: Provides sensible defaults
- **Missing configuration**: Uses fallback values

## Troubleshooting

### Common Issues

1. **NVIDIA API key not working**
   - Check the key format
   - Ensure the key has the correct permissions
   - Verify the API endpoint is accessible

2. **Video rendering fails**
   - Check available disk space
   - Verify Remotion dependencies are installed
   - Ensure proper Node.js version

3. **Audio generation fails**
   - Check network connectivity
   - Verify TTS model availability
   - Ensure proper voice configuration

### Getting Help

For issues or questions:
- Check the logs for detailed error messages
- Verify all environment variables are set
- Check NVIDIA API quota and usage
- Review the generated scripts and audio files

## License

ISC

## Copyright

(c) 2024 Tania's Cuisine & Lounge

---

*Note: This skill is part of the Remotion ecosystem and integrates seamlessly with existing Remotion projects. It provides a high-level interface for creating professional video content with minimal configuration.*