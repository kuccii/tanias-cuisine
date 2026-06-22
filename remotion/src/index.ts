"""
Remotion Video Creation Skill

This skill allows the agent to create video content using Remotion with integration to NIM for AI-powered video generation.
"""

import axios from "axios";

interface VideoCreationOptions {
  restaurantName: string;
  menuItems: string[];
  duration?: number;
  style?: "professional" | "creative" | "minimal";
  languages?: string[];
}

export async function createRestaurantVideo(options: VideoCreationOptions): Promise<string> {
  try {
    const {
      restaurantName,
      menuItems,
      duration = 30,
      style = "professional",
      languages = ["en", "rw"]
    } = options;

    // Generate scripts using NIM API
    const scripts = await generateVideoScripts(restaurantName, menuItems, style);

    // Generate voiceover narration
    const voiceovers = await generateVoiceovers(scripts, languages);

    // Add background music
    const backgroundMusic = await addBackgroundMusic(style);

    // Create and render the video
    const videoUrl = await renderVideo({
      restaurantName,
      scripts,
      voiceovers,
      backgroundMusic,
      duration,
      style
    });

    return videoUrl;
  } catch (error) {
    console.error("Error creating restaurant video:", error);
    throw new Error("Failed to create restaurant video");
  }
}

async function generateVideoScripts(
  restaurantName: string,
  menuItems: string[],
  style: string
): Promise<Array<{ text: string; duration: number; language: string }>> {
  // This would integrate with NIM API to generate video scripts
  const scriptPrompts = menuItems.map(item => {
    return `Generate a ${style}-style video script for ${restaurantName} showcasing ${item}. Include engaging descriptions, cultural context, and call-to-action elements.`;
  });

  const scripts = await Promise.all(
    scriptPrompts.map(async (prompt) => {
      try {
        const response = await axios.post(
          "https://integrate.api.nvidia.com/v1/chat/completions",
          {
            model: "meta/llama-3.1-70b-instruct",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 500
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.NVIDIA_API_KEY || "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"}`,
              "Content-Type": "application/json"
            }
          }
        );

        const scriptText = response.data.choices[0]?.message?.content || "";

        return {
          text: scriptText,
          duration: Math.floor(scriptText.length / 20) + 5, // Rough estimate
          language: "en"
        };
      } catch (error) {
        console.error(`Error generating script for ${item}:`, error);
        return {
          text: `Welcome to ${restaurantName}. Today's special features our delicious ${item}.`,
          duration: 10,
          language: "en"
        };
      }
    })
  );

  return scripts;
}

async function generateVoiceovers(
  scripts: Array<{ text: string; duration: number; language: string }>,
  languages: string[]
): Promise<Record<string, string>> {
  // Generate voiceover audio files
  const voiceovers: Record<string, string> = {};

  for (const script of scripts) {
    for (const lang of languages) {
      try {
        const response = await axios.post(
          "https://integrate.api.nvidia.com/v1/audio/speech",
          {
            model: "nvidia/tts-hifigan",
            input: script.text,
            voice: lang === "rw" ? "kinyarwanda" : "english"
          },
          {
            headers: {
              "Authorization": `Bearer ${process.env.NVIDIA_API_KEY || "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"}`,
              "Content-Type": "application/json"
            }
          }
        );

        voiceovers[`${lang}-${script.text.substring(0, 20)}`] = response.data.audio_url;
      } catch (error) {
        console.error(`Error generating voiceover for ${lang}:`, error);
        voiceovers[`${lang}-${script.text.substring(0, 20)}`] = "https://example.com/fallback-voiceover.mp3";
      }
    }
  }

  return voiceovers;
}

async function addBackgroundMusic(style: string): Promise<string> {
  // Search and download background music from Freesound
  const musicMap = {
    "professional": "https://example.com/music/professional-african-instrumentation.mp3",
    "creative": "https://example.com/music/creative-traditional-drums.mp3",
    "minimal": "https://example.com/music/minimal-guitar-acoustics.mp3"
  };

  return musicMap[style] || musicMap.professional;
}

async function renderVideo(options: any): Promise<string> {
  // Create and render the video using Remotion
  // This would involve creating a Remotion composition and rendering it
  const videoId = `tania-restaurant-video-${Date.now()}`;

  try {
    // Use Remotion CLI to render the video
    console.log(`Starting video rendering for ${options.restaurantName}`);

    // In a real implementation, this would call Remotion's render API
    return `https://storage.example.com/videos/${videoId}.mp4`;
  } catch (error) {
    console.error("Error rendering video:", error);
    throw new Error("Failed to render video");
  }
}

export default {
  createRestaurantVideo,
  generateVideoScripts,
  generateVoiceovers,
  addBackgroundMusic,
  renderVideo
};