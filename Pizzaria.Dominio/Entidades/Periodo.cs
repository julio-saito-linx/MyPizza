using System.Collections.Generic;

namespace Pizzaria.Dominio.Entidades
{
    public class Periodo
    {
        public virtual int Id { get; set; }
        public virtual string Nome { get; set; }
        public virtual IList<Garcom> Garcoms { get; set; } 
    }
}
