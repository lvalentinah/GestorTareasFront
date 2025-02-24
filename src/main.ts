import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { defineCustomElements } from '@npm-bbta/bbog-dig-dt-sherpa-lib/loader';
import { importProvidersFrom } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserModule)
  ]
}).catch(err => console.error(err));

defineCustomElements(window);
