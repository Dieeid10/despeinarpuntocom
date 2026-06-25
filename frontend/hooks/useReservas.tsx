import { useEffect, useMemo, useState } from "react";
import { reservasServices } from "@/services/reservas";
import type { ReservasState } from "@/interfaces";

export function useReservas() {
  const [state, setState] = useState<ReservasState>({
    reservas: [],
    loading: true,
    error: null,
    filtroEstado: "",
    filtroTipo: "",
    busqueda: "",
  });

  const patchState = (updates: Partial<ReservasState>) => {
    setState((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const fetchReservas = async () => {
    patchState({
      loading: true,
      error: null,
    });

    const result = await reservasServices.getReservas();

    if (!result.success) {
      patchState({
        error: result.message,
        loading: false,
      });

      return;
    }

    patchState({
      reservas: result.data,
      loading: false,
    });
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const reservasFiltradas = useMemo(() => {
    return state.reservas.filter((r) => {
      const matchEstado =
        !state.filtroEstado || r.estado === state.filtroEstado;

      const matchTipo =
        !state.filtroTipo || r.tipo_reserva === state.filtroTipo;

      const matchBusqueda =
        !state.busqueda ||
        r.cliente_nombre
          .toLowerCase()
          .includes(state.busqueda.toLowerCase());

      return matchEstado && matchTipo && matchBusqueda;
    });
  }, [state.reservas, state.filtroEstado, state.filtroTipo, state.busqueda, ]);

  return {
    ...state,
    patchState,
    fetchReservas,
    reservasFiltradas,
  };
}