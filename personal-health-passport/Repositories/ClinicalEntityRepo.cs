using Microsoft.EntityFrameworkCore;
using personal_health_passport.Models;

namespace personal_health_passport.Repositories
{
    public interface IClinicalEntityRepo
    {
        public List<ClinicalEntity> GetAllEntities();

        public List<ClinicalEntity> GetAllEntitiesByUser(int? userId);

        public ClinicalEntity? GetEntity(int id);

        public ClinicalEntity AddEntity(ClinicalEntity Entity);

        public ClinicalEntity? UpdateEntity(int id, ClinicalEntity updatedEntity);

        public bool DeleteEntity(int id);

        public void DeleteEntities(List<ClinicalEntity> Entities);

    }
    public class ClinicalEntityRepo : IClinicalEntityRepo
    {
        private ClinicalDbContext _dbContext;

        public ClinicalEntityRepo(ClinicalDbContext context)
        {
            _dbContext = context;
        }

        public List<ClinicalEntity> GetAllEntities()
        {
            return _dbContext.Entities.ToList();
        }

   

        public List<ClinicalEntity> GetAllEntitiesByUser(int? userId)
        {
            return _dbContext.Entities.Where(x => x.Uid == userId).ToList();
        }

        public ClinicalEntity? GetEntity(int id)
        {

            var existingEntity = _dbContext.Entities.FirstOrDefault(e => e.Id == id);

            if (existingEntity == null)
                return null;

            return existingEntity;
        }


        public ClinicalEntity AddEntity(ClinicalEntity Entity)
        {
            _dbContext.Entities.Add(Entity);
            _dbContext.SaveChanges();
            return Entity;
        }


        public ClinicalEntity? UpdateEntity(int id, ClinicalEntity updatedEntity)
        {
            var existingEntity = _dbContext.Entities.FirstOrDefault(e => e.Id == id);

            if (existingEntity == null)
                return null;

            //this I am a bit confused, is it not overwriting? it is copying everything
            //for example in the Post you would get updateEntity.UserId = 0 , but the client would not send it 
            //set value will copy everything from the post and EF save it overwritng the actual Id?

            _dbContext.Entry(existingEntity).CurrentValues.SetValues(updatedEntity);

            _dbContext.SaveChanges();

            return existingEntity;
        }

        public bool DeleteEntity(int id)
        {
            var entity = _dbContext.Entities.FirstOrDefault(e => e.Id == id);

            if (entity == null)
                return false;

            _dbContext.Entities.Remove(entity);
            _dbContext.SaveChanges();

            return true;
        }

        public void DeleteEntities(List<ClinicalEntity> Entities)
        {

            foreach (ClinicalEntity e in Entities)
            {
                var entity = _dbContext.Entities.FirstOrDefault(x => x.Id == e.Id);

                if (entity == null)
                    continue;

                _dbContext.Entities.Remove(entity);
            }

            _dbContext.SaveChanges();

        }
    }
}
