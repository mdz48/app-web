import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { SelectionComponent } from './component/selection/selection.component';
import { CalendarComponent } from './component/calendar/calendar.component';


export const routes: Routes = [
    {path: '', component:HomeComponent},
    {path: 'login', component: LoginComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'selection', component: SelectionComponent},
    {path: 'calendar', component: CalendarComponent},
];
