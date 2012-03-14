using Pizzaria.Dominio.Entidades;
using Pizzaria.Dominio.Repositorios;
namespace Pizzaria.Dominio.Servicos
{
    public class ErroServico : IErroServico
    {
        private readonly IErroDAO _erroDao;
        public ErroServico(IErroDAO erroDao)
        {
            _erroDao = erroDao;
        }

        public void Save(Erro erro)
        {
            _erroDao.Save(erro);
        }
    }
}
