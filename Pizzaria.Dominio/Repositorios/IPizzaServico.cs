using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IPizzaServico
    {
        Pizza PesquisarID(int id);
        Pizza PesquisarNome(string nome);
        IList<Pizza> PesquisarTodos();
        void Save(Pizza pizza);
        void Delete(int id);
    }
}