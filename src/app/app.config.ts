import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { AuthInterceptor } from './Http-interceptors/authInterceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LucideAngularModule, Bell, MessageCircle } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
  provideHttpClient(),
  importProvidersFrom(HttpClientModule),
  importProvidersFrom(LucideAngularModule.pick({Bell, MessageCircle})),
{provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi : true}, provideAnimationsAsync()]
};
