using System.Web.Script.Serialization;

namespace Pizzaria.Dominio.Entidades
{
    public class Ingrediente
    {
        public virtual int Id { get; set; }
        public virtual string Nome { get; set; }
        //[ScriptIgnore] /* comentado para testar o automapping*/
        public virtual Pizza Pizza { get; set; }
    }
}
