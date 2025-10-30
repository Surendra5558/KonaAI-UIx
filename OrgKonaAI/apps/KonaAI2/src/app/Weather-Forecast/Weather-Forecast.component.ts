// app.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ConfigLoaderService } from 'shared/src/lib/config/config-loader.service';



//////////////////////
// Interfaces
//////////////////////
export interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

export interface WeatherResponse {
  city: string;
  country: string;
  forecasts: WeatherForecast[];
}

export interface ApiTestResult {
  status: 'success' | 'error' | 'loading';
  data?: WeatherResponse;
  error?: string;
  responseTime?: number;
  statusCode?: number;
}
@Component({
  selector: 'app-weather-forecast',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './Weather-Forecast.component.html',
  styleUrls: ['./Weather-Forecast.component.scss']
})
export class WeatherForecastComponent implements OnInit {
  
 
 cityName = 'London';
  apiKey = '';
  isLoading = false;
  currentTest: string | null = null;

  testResults: Array<{
    apiName: string;
    status: 'success' | 'error' | 'loading';
    result: ApiTestResult;
    timestamp: Date;
  }> = [];

  // private apiEndpoints = {
  //   localAPI: 'https://localhost:44355/api/WeatherForecast'
  
  // };

  constructor(private http: HttpClient,private configsLoaderService: ConfigLoaderService,) {}

  ngOnInit() {
    const savedApiKey = localStorage.getItem('weatherApiKey');
    if (savedApiKey) {
      this.apiKey = savedApiKey;
    }
  }

  //////////////////////
  // Test APIs
  //////////////////////
  testOpenWeatherMap() {
    if (!this.apiKey.trim()) {
      alert('Please enter your OpenWeatherMap API key');
      return;
    }

    this.isLoading = true;
    this.currentTest = 'openweather';
    localStorage.setItem('weatherApiKey', this.apiKey);

    // You can implement actual OpenWeatherMap call here if needed
    setTimeout(() => {
      this.addTestResult('OpenWeatherMap (Mock)', {
        status: 'success',
        data: {
          city: 'London',
          country: 'UK',
          forecasts: [
            { date: '2025-09-26', temperatureC: 20, temperatureF: 68, summary: 'Sunny' }
          ]
        },
        statusCode: 200,
        responseTime: 150
      });
      this.isLoading = false;
      this.currentTest = null;
    }, 1000);
  }

  testLocalAPI() {
    this.isLoading = true;
    this.currentTest = 'local';
     let baseUser = this.configsLoaderService.apiBaseUrl;
      const url = `${baseUser}/WeatherForecast`; 

    const startTime = performance.now();
    this.http.get<WeatherForecast[]>(url).pipe(
      map(response => {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        const weatherData: WeatherResponse = {
          city: 'Local Test',
          country: 'Test',
          forecasts: response
        };
        return {
          status: 'success' as const,
          data: weatherData,
          responseTime,
          statusCode: 200
        };
      }),
      catchError((error: HttpErrorResponse) => {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);
        return of({
          status: 'error' as const,
          error: this.getErrorMessage(error),
          responseTime,
          statusCode: error.status
        });
      })
    ).subscribe({
      next: (result) => {
        this.addTestResult('Local .NET API', result);
        this.isLoading = false;
        this.currentTest = null;
      },
      error: () => {
        this.isLoading = false;
        this.currentTest = null;
      }
    });
  }

  //////////////////////
  // Helpers
  //////////////////////
  clearResults() {
    this.testResults = [];
  }

  private addTestResult(apiName: string, result: ApiTestResult) {
    this.testResults.unshift({
      apiName,
      status: result.status,
      result,
      timestamp: new Date()
    });
    if (this.testResults.length > 10) {
      this.testResults = this.testResults.slice(0, 10);
    }
  }

  getStatusCodeClass(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) {
      return 'success';
    }
    return 'error';
  }

  getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return `Network error: ${error.error.message}`;
    } else {
      switch (error.status) {
        case 0: return 'Unable to connect to server. Check if the API is running and CORS is configured.';
        case 401: return 'Unauthorized: Invalid API key or authentication required.';
        case 403: return 'Forbidden: Access denied.';
        case 404: return 'API endpoint not found.';
        case 429: return 'Too many requests: Rate limit exceeded.';
        case 500: return 'Internal server error.';
        default: return `HTTP ${error.status}: ${error.message}`;
      }
    }
  }

  getErrorSuggestions(error: string): string[] {
    const suggestions: string[] = [];
    if (error.includes('CORS')) {
      suggestions.push('Enable CORS on your API server');
      suggestions.push('Add proper CORS headers to your API responses');
    }
    if (error.includes('Unable to connect')) {
      suggestions.push('Check if your API server is running');
      suggestions.push('Verify the API endpoint URL is correct');
      suggestions.push('Check your network connection');
    }
    if (error.includes('Invalid API key')) {
      suggestions.push('Verify your API key is correct');
      suggestions.push('Check if your API key has proper permissions');
    }
    if (error.includes('Rate limit')) {
      suggestions.push('Wait before making another request');
      suggestions.push('Consider upgrading your API plan');
    }
    return suggestions;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
