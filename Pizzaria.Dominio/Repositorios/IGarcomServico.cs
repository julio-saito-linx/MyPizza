using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IGarcomServico
    {
        Garcom PesquisarID(int id);
        IList<Garcom> PesquisarTodos();
        void Save(Garcom garcom);
    }
}
