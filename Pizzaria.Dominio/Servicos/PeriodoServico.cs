using System.Collections.Generic;
using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;

namespace Pizzaria.Dominio.Servicos
{
    public class PeriodoServico : IPeriodoServico
    {
        private readonly IPeriodoDAO _periodoDAO;

        public PeriodoServico(IPeriodoDAO periodoDAO)
        {
            _periodoDAO = periodoDAO;
        }
        
        public Periodo PesquisarID(int id)
        {
            return _periodoDAO.Get(id);
        }

        public IList<Periodo> PesquisarTodos()
        {
            return _periodoDAO.GetAll();
        }

        public void Save(Periodo periodo)
        {
            _periodoDAO.Save(periodo);
        }
    }
}
