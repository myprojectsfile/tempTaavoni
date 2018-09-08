import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { QueueComponent } from './queue/queue.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AppRoutingModule } from './app-routing.module';
import { DxDataGridModule } from 'devextreme-angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth/auth.guard';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { Angular2ImageGalleryModule } from 'angular2-image-gallery';
import { ProjectsShowComponent } from './projects-show/projects-show.component';
import { RequestAdminComponent } from './request-admin/request-admin.component';
import { DarkhastComponent } from './darkhast/darkhast.component';
import { MoamelatComponent } from './moamelat/moamelat.component';
import { ProfileComponent } from './user/profile/profile.component';
import { PortfoComponent } from './user/portfo/portfo.component';
import { ApiService } from './shared/services/api.service';
import { JalaliDatePipe, JalaliDatetimePipe } from './shared/pipes/jalali-date.pipe';
import { EqualValidator } from './shared/validators/equal-validator.directive';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { FileManagerComponent } from './shared/components/file-manager/file-manager.component';
import { FileManagerService } from './shared/components/file-manager/file-manager.service';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    QueueComponent,
    HomePageComponent,
    LoginComponent,
    RegisterComponent,
    PhotoGalleryComponent,
    ProjectsShowComponent,
    RequestAdminComponent,
    DarkhastComponent,
    MoamelatComponent,
    ProfileComponent,
    PortfoComponent,
    JalaliDatePipe,
    JalaliDatetimePipe,
    EqualValidator,
    UserAdminComponent,
    FileManagerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
    }),
    AppRoutingModule,
    DxDataGridModule,
    HttpClientModule,
    FormsModule,
    Angular2ImageGalleryModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4200']
      }
    })
  ],
  providers: [FileManagerService,ApiService, AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  }, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
