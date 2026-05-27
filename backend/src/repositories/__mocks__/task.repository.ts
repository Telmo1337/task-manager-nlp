export class TaskRepository {
  create = jest.fn();
  findAll = jest.fn();
  findByDate = jest.fn();
  findDueOnDate = jest.fn();
  findDuplicate = jest.fn();
  deleteById = jest.fn();
  updateById = jest.fn();
}
