import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DestinationComponent } from "./destination/destination.component";
import { AboutComponent } from "./about/about.component";
import { ContactUsComponent } from "./contact-us/contact-us.component";
import { JourneyComponent } from "./journey/journey.component";

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: HomeComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'destination',
        component: DestinationComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'contact-us',
        component: ContactUsComponent
    },
    {
        path: 'about',
        component: AboutComponent
    },
    {
        path: 'journey',
        component: JourneyComponent
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
})
export class AppRoutingModule {}
