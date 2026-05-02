import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChambreService {
  private readonly API_URL = 'http://localhost:8080/api/chambres';
  private http = inject(HttpClient);

  // ──────────────────────────────────────
  // SIGNALS
  // ──────────────────────────────────────
  private _rooms = signal<any[]>([]);
  private _isLoading = signal(false);
  private _error = signal<string | null>(null);

  readonly rooms = this._rooms.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly stats = computed(() => {
    const r = this._rooms();
    return {
      total: r.length,
      disponible: r.filter(x => x.status === 'DISPONIBLE').length,
      occupee: r.filter(x => x.status === 'OCCUPEE').length,
      en_nettoyage: r.filter(x => x.status === 'EN_NETTOYAGE').length,
      en_maintenance: r.filter(x => x.status === 'EN_MAINTENANCE').length,
    };
  });

  constructor() {
    this.loadRooms();
  }

  loadRooms(): void {
    this._isLoading.set(true);
    this._error.set(null);

    this.http.get<any[]>(this.API_URL)
      .pipe(
        tap(rooms => {
          this._rooms.set(rooms);
          console.log('✅ Chambres chargées:', rooms.length);
        }),
        catchError(err => {
          this._error.set('Erreur lors du chargement des chambres');
          console.error('❌ Erreur:', err);
          return throwError(() => err);
        }),
        finalize(() => this._isLoading.set(false))
      )
      .subscribe();
  }

  // ─────────────────────��────────────────
  // FILTRAGE
  // ──────────────────────────────────────

  getFilteredRooms(filter: string | 'all'): any[] {
    const all = this._rooms();
    return filter === 'all' ? all : all.filter(r => r.status === filter);
  }

  getFloors(filter: string | 'all'): number[] {
    return [...new Set(this.getFilteredRooms(filter).map(r => r.floor))].sort((a, b) => a - b);
  }

  getRoomsByFloor(floor: number, filter: string | 'all'): any[] {
    return this.getFilteredRooms(filter).filter(r => r.floor === floor);
  }

  getChambreById(id: number): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/${id}`)
      .pipe(
        catchError(err => {
          console.error('❌ Erreur:', err);
          return throwError(() => err);
        })
      );
  }

  // ──────────────────────────────────────
  // CRUD
  // ──────────────────────────────────────

  createChambre(request: any): Observable<any> {
    this._isLoading.set(true);
    return this.http.post<any>(this.API_URL, request)
      .pipe(
        tap(newRoom => {
          this._rooms.update(rooms => [...rooms, newRoom]);
          console.log('✅ Chambre créée:', newRoom.id);
        }),
        catchError(err => {
          this._error.set('Erreur lors de la création');
          console.error('❌ Erreur:', err);
          return throwError(() => err);
        }),
        finalize(() => this._isLoading.set(false))
      );
  }

  updateChambre(id: number, request: any): Observable<any> {
    this._isLoading.set(true);
    return this.http.put<any>(`${this.API_URL}/${id}`, request)
      .pipe(
        tap(updatedRoom => {
          this._rooms.update(rooms =>
            rooms.map(r => r.id === id ? updatedRoom : r)
          );
          console.log('✅ Chambre mise à jour:', id);
        }),
        catchError(err => {
          this._error.set('Erreur lors de la mise à jour');
          console.error('❌ Erreur:', err);
          return throwError(() => err);
        }),
        finalize(() => this._isLoading.set(false))
      );
  }

  deleteChambre(id: number): Observable<void> {
    this._isLoading.set(true);
    return this.http.delete<void>(`${this.API_URL}/${id}`)
      .pipe(
        tap(() => {
          this._rooms.update(rooms => rooms.filter(r => r.id !== id));
          console.log('✅ Chambre supprimée:', id);
        }),
        catchError(err => {
          this._error.set('Erreur lors de la suppression');
          console.error('❌ Erreur:', err);
          return throwError(() => err);
        }),
        finalize(() => this._isLoading.set(false))
      );
  }

  // ──────────────────────────────────────
  // GESTION DE STATUTS
  // ──────────────────────────────────────

  assignCleaning(roomId: number, request: { staff: string }): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/${roomId}/assign-cleaning`,
      request
    ).pipe(
      tap(updatedRoom => {
        this._rooms.update(rooms =>
          rooms.map(r => r.id === roomId ? updatedRoom : r)
        );
        console.log('✅ Nettoyage assigné:', roomId);
      }),
      catchError(err => {
        this._error.set('Erreur lors de l\'assignation');
        console.error('❌ Erreur:', err);
        return throwError(() => err);
      })
    );
  }

  assignMaintenance(roomId: number, request: { staff: string; notes?: string }): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/${roomId}/assign-maintenance`,
      request
    ).pipe(
      tap(updatedRoom => {
        this._rooms.update(rooms =>
          rooms.map(r => r.id === roomId ? updatedRoom : r)
        );
        console.log('✅ Maintenance assignée:', roomId);
      }),
      catchError(err => {
        this._error.set('Erreur lors de l\'assignation');
        console.error('❌ Erreur:', err);
        return throwError(() => err);
      })
    );
  }

  assignGuest(roomId: number, guest: any): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/${roomId}/assign-guest`,
      { guestName: guest.name, guestEmail: guest.email, guestPhone: guest.phone, guestCheckIn: guest.checkIn, guestCheckOut: guest.checkOut }
    ).pipe(
      tap(updatedRoom => {
        this._rooms.update(rooms =>
          rooms.map(r => r.id === roomId ? updatedRoom : r)
        );
        console.log('✅ Client assigné:', roomId);
      }),
      catchError(err => {
        this._error.set('Erreur lors de l\'assignation');
        console.error('❌ Erreur:', err);
        return throwError(() => err);
      })
    );
  }

  checkout(roomId: number): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/${roomId}/checkout`,
      {}
    ).pipe(
      tap(updatedRoom => {
        this._rooms.update(rooms =>
          rooms.map(r => r.id === roomId ? updatedRoom : r)
        );
        console.log('✅ Check-out effectué:', roomId);
      }),
      catchError(err => {
        this._error.set('Erreur lors du check-out');
        console.error('❌ Erreur:', err);
        return throwError(() => err);
      })
    );
  }

  markAvailable(roomId: number): Observable<any> {
    return this.http.patch<any>(
      `${this.API_URL}/${roomId}/mark-available`,
      {}
    ).pipe(
      tap(updatedRoom => {
        this._rooms.update(rooms =>
          rooms.map(r => r.id === roomId ? updatedRoom : r)
        );
        console.log('✅ Chambre marquée disponible:', roomId);
      }),
      catchError(err => {
        this._error.set('Erreur lors de la mise à jour');
        console.error('❌ Erreur:', err);
        return throwError(() => err);
      })
    );
  }

  clearError(): void {
    this._error.set(null);
  }

  refresh(): void {
    this.loadRooms();
  }
}