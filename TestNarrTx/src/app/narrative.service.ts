import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface NarrativeResponse {
  success: boolean;
  message: string;
  cleanedText: string;
  readabilityScore: number;
  originalText: string;
  wordsRemoved?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NarrativeService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  processNarrative(text: string): Observable<NarrativeResponse> {
    return this.http.post<NarrativeResponse>(`${this.apiUrl}/process-narrative`, { text });
  }

  checkHealth(): Observable<any> {
    return this.http.get(`${this.apiUrl}/health`);
  }
}
