using Microsoft.EntityFrameworkCore;
using personal_health_passport.DTOs;
using personal_health_passport.Models;
using personal_health_passport.Repositories;

namespace personal_health_passport.Services
{
    public interface IClinicalEntityService
    {
        public bool AddEntitiesToDb(ClinicalTextResponse response);
        public ClinicalEntity? GetEntity(int id);

        public List<ClinicalEntity> GetAllEntitiesByUser(string? userId);

        public ClinicalEntity AddEntity(ClinicalEntity Entity);

        public ClinicalEntity? UpdateEntity(int id, ClinicalEntity updatedEntity);

        public bool DeleteEntity(int id);

        public void DeleteEntities(List<ClinicalEntity> Entities);

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
            foreach (ClinicalEntity e in response.Entities)
            {
                ClinicalEntity? entry = _entityRepo.AddEntity(e);
                if (entry == null) return false;
            }

            return true;

        }
        public ClinicalEntity? GetEntity(int id)
        {

            var existingEntity = _entityRepo.GetEntity(id);

            return existingEntity;
        }

        public List<ClinicalEntity> GetAllEntitiesByUser(string? userId)
        {
            return _entityRepo.GetAllEntitiesByUser(userId);
        }


        public ClinicalEntity AddEntity(ClinicalEntity Entity)
        {
            ClinicalEntity result = _entityRepo.AddEntity(Entity);

            return result;
        }


        public ClinicalEntity? UpdateEntity(int id, ClinicalEntity updatedEntity)
        {
            ClinicalEntity result = _entityRepo.UpdateEntity(id, updatedEntity);     

            return result;
        }

        public bool DeleteEntity(int id)
        {
            return _entityRepo.DeleteEntity(id);
        }

        public void DeleteEntities(List<ClinicalEntity> Entities)
        {

            _entityRepo.DeleteEntities(Entities);
       
        }
    }
}
