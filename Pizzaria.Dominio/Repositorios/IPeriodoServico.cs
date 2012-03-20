using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IPeriodoServico
    {
        Periodo PesquisarID(int id);
        IList<Periodo> PesquisarTodos();
        void Save(Periodo periodo);
    }
}