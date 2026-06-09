import { Routes,RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CatalogComponent } from './pages/catalog/catalog.component/catalog.component';
import { AuthGuard } from './guards/auth.guard-guard';
import { UserRegistrationComponent } from './pages/user-registration/user-registration.component/user-registration.component';
import { Login } from './pages/login/login/login';
import { FavoritesComponent } from './pages/favorites/favorites.component/favorites.component';
import { AddHeroComponent } from './pages/add-hero/add-hero.component/add-hero.component';
import { AboutComponent } from './pages/about/about.component/about.component';
import { ProfileComponent } from './pages/profile.component/profile.component'; // <-- NUEVO
``

export const routes: Routes = [

{ path: 'catalog', component: CatalogComponent }, // canActivate: [AuthGuard]
{ path: 'user-registration', component: UserRegistrationComponent },
{ path: 'about', component: AboutComponent },
{ path: 'add-hero', component: AddHeroComponent, canActivate: [AuthGuard] },
{ path: 'login', component: Login },
{ path: 'favoritos', component: FavoritesComponent, canActivate: [AuthGuard] },
{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
{ path: '**', component: CatalogComponent },
];  

@NgModule({
imports: [RouterModule.forRoot(routes)],
exports: [RouterModule]
})
export class AppRoutingModule { }
