/**
 * Title: app-routing.module.ts
 * Author: Professor Krasso
 * Date: 8/5/23
 */

// imports statements
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseLayoutComponent } from './layouts/base-layout/base-layout.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { signInGuard } from './sign-in.guard';
import { NotFoundComponent } from './not-found/not-found.component';
import { TasksComponent } from './tasks/tasks.component';

// routes array with a path, component, and title for each route in the application (e.g. home, about, contact, etc.)
const routes: Routes = [
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
        title: 'Nodebucket: Home' 
      },
      {
        path: 'home',
        component: HomeComponent,
        title: 'Nodebucket: Home'
      },
      {
        path: 'sign-in',
        component: SignInComponent,
        title: 'Nodebucket: Sign-In'
      },
      {
        path: 'about',
        component: AboutComponent,
        title: 'Nodebucket: About Us'
      },
      {
        path: 'contact',
        component: ContactComponent,
        title: 'Nodebucket: Contact Us'
      },
      {
        path:'not-found',
        component: NotFoundComponent,
        title: 'Nodebucket: 404 Not Found'
      },
    ],
  },
  {
    path: 'session',
    component: AuthLayoutComponent,
    canActivate: [signInGuard],
    children: [
      {
        path: 'tasks',
        component: TasksComponent,
        title: 'Nodebucket: Tasks'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'not-found'
  },
  {
    // path for the security module (e.g. login, register, forgot password, etc.)
    path: 'security',
    loadChildren: () => import('./security/security.module').then(m => m.SecurityModule)
  }
];

@NgModule({
  // imports the RouterModule and defines the routes array and other options (e.g. useHash, enableTracing, scrollPositionRestoration)
  imports: [RouterModule.forRoot(routes, { useHash: true, enableTracing: false, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
