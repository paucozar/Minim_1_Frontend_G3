import { Component, OnInit } from '@angular/core';
import { GymService } from '../services/gym.service';
import { Gym } from '../models/gym.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-gym',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './gym.component.html',
  styleUrl: './gym.component.css'
})
export class GymComponent implements OnInit {
  gyms: Gym[] = [];
  newGym: Gym = { id: 0, name: '', place: '', price: 0 };
  selectedGym: Gym | null = null;

  constructor(private gymService: GymService) {}

  ngOnInit(): void {
    this.getGyms();
  }

  // Obtener todos los gimnasios
  getGyms(): void {
    this.gymService.getGyms().subscribe(
      (data) => {
        this.gyms = data;
      },
      (error) => {
        console.error('Error al obtener gimnasios:', error);
      }
    );
  }
    // Crear un nuevo gimnasio
    createGym(): void {
      this.gymService.createGym(this.newGym).subscribe(
        (data) => {
          this.gyms.push(data);
          this.newGym = { id: 0, name: '', place: '', price: 0 }; // Resetear el formulario
        },
        (error) => {
          console.error('Error al crear gimnasio:', error);
        }
      );
    }
  
    // Actualizar un gimnasio
    updateGym(): void {
      if (this.selectedGym) {
        this.gymService.updateGym(this.selectedGym.id, this.selectedGym).subscribe(
          (data) => {
            const index = this.gyms.findIndex((g) => g.id === data.id);
            if (index !== -1) {
              this.gyms[index] = data;
            }
            this.selectedGym = null; // Limpiar selección
          },
          (error) => {
            console.error('Error al actualizar gimnasio:', error);
          }
        );
      }
    }
      // Eliminar un gimnasio
  deleteGym(id: number): void {
    this.gymService.deleteGym(id).subscribe(
      () => {
        this.gyms = this.gyms.filter((g) => g.id !== id);
      },
      (error) => {
        console.error('Error al eliminar gimnasio:', error);
      }
    );
  }

  // Seleccionar un gimnasio para editar
  selectGym(gym: Gym): void {
    this.selectedGym = { ...gym }; // Crear una copia para evitar modificar directamente
  }
}