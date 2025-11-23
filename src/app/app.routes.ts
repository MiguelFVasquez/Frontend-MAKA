import { Routes } from '@angular/router';

/**
 * Rutas organizadas según la estructura del proyecto `src/app/components`.
 * Se usan import dinámicos con la ruta correcta a los archivos TS.
 */
export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout/layout').then(m => m.Layout),
    children: [
      { path: '', redirectTo: 'products', pathMatch: 'full' },

      {
        path: 'products',
        children: [
          { path: '', loadComponent: () => import('./components/product/product-list/product-list').then(m => m.ProductList) },
          { path: 'new', loadComponent: () => import('./components/product/product-form/product-form').then(m => m.ProductForm) },
          { path: ':id', loadComponent: () => import('./components/product/product-form/product-form').then(m => m.ProductForm) },
        ],
      },

      {
        path: 'movements',
        children: [
          { path: '', loadComponent: () => import('./components/movement/movement-list/movement-list').then(m => m.MovementList) },
          { path: 'new', loadComponent: () => import('./components/movement/movement-form/movement-form').then(m => m.MovementForm) },
          { path: 'in', loadComponent: () => import('./components/movement/movement-form/movement-form').then(m => m.MovementForm) },
          { path: 'out', loadComponent: () => import('./components/movement/movement-form/movement-form').then(m => m.MovementForm) },
        ],
      },

    ],
  },
];
