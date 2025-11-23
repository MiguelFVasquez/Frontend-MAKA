import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MovementResponse } from '../../../models/Movement/MovementRespone';

@Component({
  selector: 'app-movement-list',
  imports: [CommonModule],
  templateUrl: './movement-list.html',
  styleUrl: './movement-list.css',
})
export class MovementList { 
    movements: MovementResponse[] = [];
}
