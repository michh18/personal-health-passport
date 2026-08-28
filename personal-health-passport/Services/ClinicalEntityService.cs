using personal_health_passport.DTOs;
using personal_health_passport.Models;
using personal_health_passport.Repositories;

namespace personal_health_passport.Services
{
    public interface IClinicalEntityService
    {
        public bool AddEntitiesToDb(ClinicalTextResponse response);
    }
    public class ClinicalEntityService : IClinicalEntityService
    {
        readonly IClinicalEntityRepo _entityRepo;

        public ClinicalEntityService(IClinicalEntityRepo repo)
        {
            _entityRepo = repo;
        }
        public bool AddEntitiesToDb(ClinicalTextResponse response)
        {
            foreach(ClinicalEntity e in response.Entities)
            {
                ClinicalEntity? entry = _entityRepo.AddEntity(e);
                if (entry == null) return false;
            }

            return true;
           
        }
    }
}
