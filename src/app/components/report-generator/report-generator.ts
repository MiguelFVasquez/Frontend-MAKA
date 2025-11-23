import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';

interface ReportType {
  id: string;
  title: string;
  description: string;
  fields: ReportField[];
}

interface ReportField {
  name: string;
  label: string;
  type: 'date' | 'select' | 'checkbox' | 'text';
  options?: { value: string; label: string }[];
  required?: boolean;
}


@Component({
  selector: 'app-report-generator',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './report-generator.html',
  styleUrl: './report-generator.css',
})
export class ReportGenerator {
   private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  form!: FormGroup;
  reportConfig?: ReportType;
  isGenerating = false;

  reportTypes: Record<string, ReportType> = {
    'products': {
      id: 'products',
      title: 'Reporte de Productos',
      description: 'Genera un reporte completo de todos los productos',
      fields: [
        {
          name: 'includeInactive',
          label: 'Incluir productos inactivos',
          type: 'checkbox'
        },
        {
          name: 'sortBy',
          label: 'Ordenar por',
          type: 'select',
          required: true,
          options: [
            { value: 'name', label: 'Nombre' },
            { value: 'stock', label: 'Stock' },
            { value: 'price', label: 'Precio' }
          ]
        }
      ]
    },
    'movements': {
      id: 'movements',
      title: 'Reporte de Movimientos',
      description: 'Historial de movimientos en un período específico',
      fields: [
        {
          name: 'dateFrom',
          label: 'Fecha desde',
          type: 'date',
          required: true
        },
        {
          name: 'dateTo',
          label: 'Fecha hasta',
          type: 'date',
          required: true
        },
        {
          name: 'movementType',
          label: 'Tipo de movimiento',
          type: 'select',
          options: [
            { value: 'all', label: 'Todos' },
            { value: 'IN', label: 'Solo entradas' },
            { value: 'OUT', label: 'Solo salidas' }
          ]
        }
      ]
    },
    'sales': {
      id: 'sales',
      title: 'Reporte de Ventas',
      description: 'Análisis de ventas y productos más vendidos',
      fields: [
        {
          name: 'dateFrom',
          label: 'Fecha desde',
          type: 'date',
          required: true
        },
        {
          name: 'dateTo',
          label: 'Fecha hasta',
          type: 'date',
          required: true
        },
        {
          name: 'includeMetrics',
          label: 'Incluir métricas avanzadas',
          type: 'checkbox'
        }
      ]
    },
    'low-stock': {
      id: 'low-stock',
      title: 'Productos con Stock Bajo',
      description: 'Lista de productos con stock por debajo del mínimo',
      fields: [
        {
          name: 'threshold',
          label: 'Stock mínimo',
          type: 'select',
          options: [
            { value: 'default', label: 'Usar mínimo configurado' },
            { value: '5', label: 'Menos de 5 unidades' },
            { value: '10', label: 'Menos de 10 unidades' },
            { value: '20', label: 'Menos de 20 unidades' }
          ]
        }
      ]
    },
    'inventory-value': {
      id: 'inventory-value',
      title: 'Valoración de Inventario',
      description: 'Valor total del inventario actual',
      fields: [
        {
          name: 'priceType',
          label: 'Tipo de precio',
          type: 'select',
          required: true,
          options: [
            { value: 'buy', label: 'Precio de compra' },
            { value: 'sale', label: 'Precio de venta' }
          ]
        },
        {
          name: 'includeCharts',
          label: 'Incluir gráficos',
          type: 'checkbox'
        }
      ]
    },
    'custom': {
      id: 'custom',
      title: 'Reporte Personalizado',
      description: 'Crea un reporte con tus propios criterios',
      fields: [
        {
          name: 'dateFrom',
          label: 'Fecha desde',
          type: 'date'
        },
        {
          name: 'dateTo',
          label: 'Fecha hasta',
          type: 'date'
        },
        {
          name: 'includeProducts',
          label: 'Incluir productos',
          type: 'checkbox'
        },
        {
          name: 'includeMovements',
          label: 'Incluir movimientos',
          type: 'checkbox'
        },
        {
          name: 'includeSales',
          label: 'Incluir ventas',
          type: 'checkbox'
        }
      ]
    }
  };

  ngOnInit() {
    const reportType = this.route.snapshot.paramMap.get('type');
    
    if (reportType && this.reportTypes[reportType]) {
      this.reportConfig = this.reportTypes[reportType];
      this.initForm();
    } else {
      this.router.navigate(['/reports']);
    }
  }

  initForm() {
    const formConfig: any = {
      format: ['pdf']
    };

    this.reportConfig?.fields.forEach(field => {
      const defaultValue = field.type === 'checkbox' ? false : '';
      formConfig[field.name] = [defaultValue];
    });

    this.form = this.fb.group(formConfig);
  }

  generateReport() {
    if (this.form.invalid) return;

    this.isGenerating = true;

    const reportData = {
      type: this.reportConfig?.id,
      ...this.form.value
    };

    console.log('Generando reporte:', reportData);

    // TODO: Implementar llamada al servicio
    // this.reportService.generate(reportData).subscribe(
    //   (blob) => {
    //     // Descargar el archivo
    //     const url = window.URL.createObjectURL(blob);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = `reporte-${this.reportConfig?.id}-${Date.now()}.${this.form.value.format}`;
    //     a.click();
    //     this.isGenerating = false;
    //   },
    //   (error) => {
    //     console.error('Error generando reporte:', error);
    //     this.isGenerating = false;
    //   }
    // );

    // Simulación
    setTimeout(() => {
      this.isGenerating = false;
      alert('¡Reporte generado! (simulación)');
    }, 2000);
  }

  goBack() {
    this.router.navigate(['/reports']);
  }
}
