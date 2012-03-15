using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class GarcomServico : IGarcomServico
    {
        private readonly IGarcomDAO _garcomDAO;

        public GarcomServico(IGarcomDAO garcomDao)
        {
            _garcomDAO = garcomDao;
        }
        
        public Garcom PesquisarID(int id)
        {
            return _garcomDAO.Get(id);
        }

        public IList<Garcom> PesquisarTodos()
        {
            return _garcomDAO.GetAll();
        }

        public void Save(Garcom garcom)
        {
            _garcomDAO.Save(garcom);
        }
    }
}
