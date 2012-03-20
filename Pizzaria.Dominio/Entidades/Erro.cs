namespace Pizzaria.Dominio.Entidades
{
    public class Erro
    {
        public virtual int Id { get; set; }
        public virtual int Codigo { get; set; }
        public virtual string Mensagem { get; set; }
    }
}