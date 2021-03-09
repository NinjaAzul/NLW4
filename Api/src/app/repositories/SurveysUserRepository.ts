import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveyUser";

@EntityRepository(SurveyUser)
class SurveyUserRepository extends Repository<SurveyUser> {
 
}




export { SurveyUserRepository };
