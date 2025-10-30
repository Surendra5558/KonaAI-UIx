import { Component } from "@angular/core";
import { Router, RouterLink, RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-home',
    standalone: true,
    //imports: [RouterOutlet, RouterLink],
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],

})
export class HomeComponent {
  constructor(
  
    private router: Router,

  ) { }

      weatherforcast(): void {
    this.router.navigate(['/WeatherForecast']);
  }
}