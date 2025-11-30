import { Component } from '@angular/core';
import { NarrativeService, NarrativeResponse } from './narrative.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TestNarrTx';
  narrativeText: string = '';
  maxLength: number = 4000;
  
  // Results
  isProcessing: boolean = false;
  showResults: boolean = false;
  cleanedText: string = '';
  readabilityScore: number = 0;
  resultMessage: string = '';
  isSuccess: boolean = false;
  wordsRemoved: number = 0;
  errorMessage: string = '';
  
  constructor(private narrativeService: NarrativeService) {}
  
  getSuggestion(): void {
    if (!this.narrativeText.trim()) {
      return;
    }
    
    this.isProcessing = true;
    this.showResults = false;
    this.errorMessage = '';
    
    this.narrativeService.processNarrative(this.narrativeText).subscribe({
      next: (response: NarrativeResponse) => {
        this.isProcessing = false;
        this.showResults = true;
        this.isSuccess = response.success;
        this.resultMessage = response.message;
        this.cleanedText = response.cleanedText;
        this.readabilityScore = response.readabilityScore;
        this.wordsRemoved = response.wordsRemoved || 0;
      },
      error: (error) => {
        this.isProcessing = false;
        this.showResults = true;
        this.isSuccess = false;
        this.errorMessage = 'Failed to process narrative. Make sure the backend server is running.';
        console.error('Error:', error);
      }
    });
  }
  
  clearResults(): void {
    this.showResults = false;
    this.cleanedText = '';
    this.readabilityScore = 0;
    this.resultMessage = '';
    this.errorMessage = '';
  }
  
  copyToClipboard(): void {
    navigator.clipboard.writeText(this.cleanedText).then(() => {
      alert('Cleaned text copied to clipboard!');
    }).catch(err => {
      console.error('Failed to copy text:', err);
    });
  }
  
  get remainingCharacters(): number {
    return this.maxLength - this.narrativeText.length;
  }
}
