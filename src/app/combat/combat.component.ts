import { Component, OnInit } from '@angular/core';
import { CombatService } from '../services/combat.service';
import { Combat } from '../models/combat.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-combat',
  imports: [ FormsModule, CommonModule ],
  standalone: true,
  templateUrl: './combat.component.html',
  styleUrl: './combat.component.css'
})
export class CombatComponent implements OnInit {
  combats: Combat[] = [];
  newCombat: Combat = { _id: '', gym: '', date: new Date(), boxers: [] };
  selectedCombat: Combat | null = null;
  boxers: string[] = [];

  constructor(private combatService: CombatService) {}

  ngOnInit(): void {
    this.getCombats();
  }

  // Obtener todos los combates
  getCombats(): void {
    this.combatService.getCombats().subscribe(
      (data) => {
        this.combats = data;
      },
      (error) => {
        console.error('Error al obtener combates:', error);
      }
    );
  }
    // Crear un nuevo combate
    createCombat(): void {
      this.combatService.createCombat(this.newCombat).subscribe(
        (data) => {
          this.combats.push(data);
          this.newCombat = { _id: '', gym: '', date: new Date(), boxers: [] }; // Resetear el formulario
        },
        (error) => {
          console.error('Error al crear combate:', error);
        }
      );
    }
  
    // Actualizar un combate
    updateCombat(): void {
      if (this.selectedCombat) {
        this.combatService.updateCombat(this.selectedCombat).subscribe(
          (data) => {
            const index = this.combats.findIndex((c) => c._id === data._id);
            if (index !== -1) {
              this.combats[index] = data;
            }
            this.selectedCombat = null; // Limpiar selección
          },
          (error) => {
            console.error('Error al actualizar combate:', error);
          }
        );
      }
    }
      // Eliminar un combate
  deleteCombat(_id: string): void {
    this.combatService.deleteCombat(_id).subscribe(
      () => {
        this.combats = this.combats.filter((c) => c._id !== _id);
      },
      (error) => {
        console.error('Error al eliminar combate:', error);
      }
    );
  }

  // Obtener boxeadores por ID del combate
  getBoxersByCombatId(_id: string): void {
    this.combatService.getBoxersByCombatId(_id).subscribe(
      (data) => {
        this.boxers = data;
      },
      (error) => {
        console.error('Error al obtener boxeadores:', error);
      }
    );
  }
    // Seleccionar un combate para editar
    selectCombat(combat: Combat): void {
      this.selectedCombat = { ...combat }; // Crear una copia para evitar modificar directamente
    }
  }

  
