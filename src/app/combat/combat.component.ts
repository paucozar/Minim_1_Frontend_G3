import { Component, OnInit } from '@angular/core';
import { CombatService } from '../services/combat.service';
import { GymService } from '../services/gym.service';
import { UserService } from '../services/user.service';
import { Combat } from '../models/combat.model';
import { Gym } from '../models/gym.model';
import { User } from '../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-combat',
  imports: [FormsModule, CommonModule, NgxPaginationModule],
  standalone: true,
  templateUrl: './combat.component.html',
  styleUrl: './combat.component.css'
})
export class CombatComponent implements OnInit {
  combats: Combat[] = [];
  gyms: Gym[] = [];
  users: User[] = [];
  newCombat: Combat = { gym: '', date: new Date(), boxers: [] };
  selectedCombat: Combat | null = null;
  boxers: string[] = [];
  loading = false;

  // Propiedades de paginación
  page: number = 1;
  pageSize: number = 10;
  totalCombats: number = 0;
  totalPages: number = 0;

  constructor(
    private combatService: CombatService,
    private gymService: GymService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loading = true;
    this.loadAllData();
  }

  // Cargar todos los datos necesarios
  loadAllData(): void {
    // Obtener datos del gimnasio
    this.gymService.getGyms(this.page, this.pageSize).subscribe({
      next: (data) => {
        this.gyms = data.gyms;

        // Obtener datos de los usuarios - Usar el valor permitido de pageSize (50)
        this.userService.getUsers(1, 25).subscribe({
          next: (userData) => {
            this.users = userData.users;

            // Si hay muchos datos de usuarios, continuar cargando las páginas restantes
            if (userData.totalPages > 1) {
              this.loadRemainingUsers(2, userData.totalPages);
            } else {
              // Obtener datos de los combates
              this.getCombats();
            }
          },
          error: (error) => {
            console.error('Error al obtener datos de los usuarios:', error);
            // A pesar del error, intentar cargar los datos de los combates
            this.getCombats();
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener datos del gimnasio:', error);
        this.loading = false;
      }
    });
  }

  // Cargar las páginas restantes de los usuarios
  loadRemainingUsers(currentPage: number, totalPages: number): void {
    if (currentPage > totalPages) {
      // Todos los datos de los usuarios han sido cargados, ahora obtener datos de los combates
      this.getCombats();
      return;
    }

    this.userService.getUsers(currentPage, 25).subscribe({
      next: (userData) => {
        // Combinar datos de los usuarios
        this.users = [...this.users, ...userData.users];
        // Continuar cargando la siguiente página
        this.loadRemainingUsers(currentPage + 1, totalPages);
      },
      error: (error) => {
        console.error(`Error al obtener datos de la página ${currentPage} de los usuarios:`, error);
        // A pesar del error, continuar cargando los datos de los combates
        this.getCombats();
      }
    });
  }

  // Obtener todos los combates
  getCombats(): void {
    this.loading = true;
    
    this.combatService.getCombats(this.page, this.pageSize).subscribe({
      next: (data) => {
        // Asegúrese de que data.combats existe, de lo contrario utilice una matriz vacía
        const combatsArray = data.combats || [];
        
        // Filtra los registros de batalla ocultos
        this.combats = combatsArray.filter((combat: Combat) => !combat.isHidden);
        
        // Actualización de la información de paginación
        this.totalCombats = data.totalCombats || 0;
        this.totalPages = data.totalPages || 0;
        
        this.loading = false;
      },
      error: (error) => {
        console.error('获取战斗列表时出错:', error);
        this.loading = false;
      }
    });
  }

  // Añadir métodos de navegación de páginas
  previousPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getCombats();
    }
  }

  nextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getCombats();
    }
  }

  // Crear un nuevo combate
  createCombat(): void {
    if (this.newCombat.date instanceof Date) {
      this.newCombat.date = this.newCombat.date.toISOString().split('T')[0];
    }
    this.loading = true;
    this.combatService.createCombat(this.newCombat).subscribe({
      next: (data) => {
        this.combats.push(data);
        this.newCombat = { gym: '', date: new Date(), boxers: [] };
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al crear el combate:', error);
        this.loading = false;
      }
    });
  }

  // Actualizar combate
  updateCombat(): void {
    if (this.selectedCombat) {
      this.loading = true;
      this.combatService.updateCombat(this.selectedCombat).subscribe({
        next: (data) => {
          const index = this.combats.findIndex((c) => c._id === data._id);
          if (index !== -1) {
            this.combats[index] = data;
          }
          this.selectedCombat = null;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al actualizar el combate:', error);
          this.loading = false;
        }
      });
    }
  }

  // Eliminar combate
  deleteCombat(id?: string): void {
    if (!id) {
      console.error('No se puede eliminar el combate: ID no definido');
      return;
    }

    if (confirm('¿Está seguro que desea eliminar este combate?')) {
      this.loading = true;
      this.combatService.deleteCombat(id).subscribe({
        next: () => {
          this.combats = this.combats.filter((c) => c._id !== id);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al eliminar el combate:', error);
          this.loading = false;
        }
      });
    }
  }

  // Seleccionar combate para editar
  selectCombat(combat: Combat): void {
    // Crear una copia profunda para evitar modificar directamente
    this.selectedCombat = JSON.parse(JSON.stringify(combat));

    // Verificar que selectedCombat existe antes de acceder a date
    if (this.selectedCombat && this.selectedCombat.date) {
      const date = new Date(this.selectedCombat.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      this.selectedCombat.date = `${year}-${month}-${day}`;
    }

    // Desplazarse al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cancelar la edición
  cancelEdit(): void {
    this.selectedCombat = null;
  }

  // Obtener el nombre del gimnasio por ID
  getGymName(gymId: string): string {
    const gym = this.gyms.find(g => g._id === gymId);
    return gym ? gym.name : 'Gimnasio desconocido';
  }

  // Obtener el nombre del usuario por ID
  getUserName(userId: string): string {
    const user = this.users.find(u => u._id === userId);
    return user ? user.name : 'Usuario desconocido';
  }


  hideCombat(id?: string): void {
    if (!id) {
      console.error('No se puede ocultar el combate: ID no definido');
      return;
    }

    if (confirm('¿Está seguro que desea ocultar este combate?')) {
      this.loading = true;
      this.combatService.hideCombat(id, true).subscribe({
        next: (response) => {
          // Solo quitamos el combate de la vista, no se elimina de la BD
          this.combats = this.combats.filter(c => c._id !== id);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al ocultar el combate:', error);
          this.loading = false;
        }
      });
    }
  }


}