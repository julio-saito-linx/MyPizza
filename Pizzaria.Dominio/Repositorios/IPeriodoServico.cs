using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
