import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class GroqClient {
  private client: OpenAI;

  constructor(private configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('GROQ_API_KEY'),
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async chat(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]): Promise<string> {
    const completion = await this.client.chat.completions.create({
      model: 'llama-3.3-70b-versatile', // Groq's fast, capable free-tier model
      messages,
      temperature: 0.3, // lower temperature: factual/consistent answers over creative ones, fitting for a college assistant
    });

    return completion.choices[0]?.message?.content ?? 'No response generated.';
  }
}