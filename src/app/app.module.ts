import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './pages/register/register.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToasterComponent } from './components/toaster/toaster.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoaderComponent } from './components/loader/loader.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { AuthInterceptorService } from './services/auth/auth-interceptor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPaginationModule } from 'ngx-pagination';
import { MovieComponent } from './pages/movie/movie.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { ListComponent } from './pages/list/list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    RegisterComponent,
    ToasterComponent,
    LoaderComponent,
    BrowseComponent,
    MovieComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgxPaginationModule,
    CarouselModule,
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
