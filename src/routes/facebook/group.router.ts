/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Request, Response, Router, RequestHandler } from 'express';
import responseFormat from "@shared/responseFormat";
import StatusCodes from 'http-status-codes';
import groupService from '@services/facebook/group.service';
import { populateUserAccessToken } from '@shared/fb';
import { UserDTO } from '@dto/user.dto';
const router = Router();
const { CREATED, OK, UNAUTHORIZED } = StatusCodes;

export const p = {
  get: '/all',
  getById: '/:groupId',
  add: '/add',
} as const;

/**
 * @swagger
 * components:
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *        - id
 *        - name
 *        - privacy
 *       properties:
 *         id:
 *           type: string
 *           description: user id
 *           example: "968221704087336"
 *         name:
 *           type: string
 *           description: name of the group
 *           example: TEST API FB ĐỒ ÁN TỐT NGHIỆP
 *         privacy:
 *           type: string
 *           description: OPEN or SECRET
 *           example: OPEN
 */

/**
 * @swagger
 * /api/facebook/groups/all:
 *   get:
 *     summary: Returns all groups of a user
 *     responses:
 *       200:
 *         description: Returns all groups of a user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *
 */
router.get(p.get, (async (
  req: Request,
  res: Response
) => {
  try {
    res.status(OK);
    if(!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook'
      });
    }
    const groups = await groupService.getAll();
    res.status(OK).json(responseFormat(true,{},groups));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);


/**
 * @swagger
 * /api/facebook/groups/{groupId}:
 *   get:
 *     summary: Returns a group info
 *     responses:
 *       200:
 *         description: Returns a group info
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *
 */
 router.get(p.getById, (async (
  req: Request,
  res: Response
) => {
  try {
    res.status(OK);
    if(!(await populateUserAccessToken(<UserDTO>req.user))) {
      res.status(UNAUTHORIZED);
      return res.json({
        message: 'User is not connected to facebook'
      });
    }
    const group = await groupService.getById(req.params.groupId);
    res.status(OK).json(responseFormat(true,{},group));
  } catch(err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(responseFormat(false));
  }
}) as RequestHandler);

export default router;
