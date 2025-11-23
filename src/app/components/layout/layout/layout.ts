import { Component } from '@angular/core';
import { Header } from '../header/header';
import { SideBar } from '../side-bar/side-bar';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [Header, SideBar,RouterModule, CommonModule],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
