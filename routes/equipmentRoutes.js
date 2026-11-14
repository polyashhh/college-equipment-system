import express from 'express';
import { 
    getAllEquipment, 
    getEquipmentById, 
    createEquipment, 
    updateEquipment, 
    deleteEquipment 
} from '../controllers/equipmentController.js';

const router = express.Router();

router.get('/', getAllEquipment);           // GET /equipment
router.get('/:id', getEquipmentById);       // GET /equipment/1
router.post('/', createEquipment);          // POST /equipment
router.put('/:id', updateEquipment);        // PUT /equipment/1
router.delete('/:id', deleteEquipment);     // DELETE /equipment/1

export default router;