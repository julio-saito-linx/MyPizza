using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;

namespace Pizzaria.Dominio.Repositorios
{
    public interface IIngredienteServico
    {
        IList<Ingrediente> PesquisarTodos();
        Ingrediente PesquisarID(int Id);
        void Save(Ingrediente ingrediente);
        void Delete(int id);
    }
}