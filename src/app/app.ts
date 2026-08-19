import { Component, signal } from '@angular/core';
import { Resume } from "./component/resume/resume";

@Component({
  selector: 'app-root',
  imports: [Resume],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('ResumeWebApp');
}
