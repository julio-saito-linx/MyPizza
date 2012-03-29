using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IPizzaServico
    {
        Pizza PesquisarID(int id);
        IList<Pizza> PesquisarPorNome(string nome);
        IList<Pizza> PesquisarTodos();
        IList<Pizza> PesquisarPorIngrediente(int ingredienteId);
        void Save(Pizza pizza);
        void Delete(int id);
    }
}