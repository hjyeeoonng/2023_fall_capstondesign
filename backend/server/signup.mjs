import express from 'express';
import db from '../db.mjs';
import jwt from 'jsonwebtoken';

const signupRouter = express.Router();

signupRouter.get('/s', (req, res) => {
    res.json("signup");
});

// /signup : 회원가입 
signupRouter.post('/signup', async (req, res) => {
  try {
    const { id, name, password, password_confirm, email, mobile, type } = req.body;

    // 사용자 생성
    const query = `
      INSERT INTO signup (id, name, password, password_confirm, email, mobile, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const values = [id, name, password, password_confirm, email, mobile, type];

    const user = await db.one(query, values);

    // JWT 생성
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // JWT를 클라이언트에게 반환
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

signupRouter.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;
    const user = await db.oneOrNone('SELECT * FROM signup WHERE id = $1', [id]);

    if (!user) {
      // 사용자가 존재하지 않음
      return res.status(401).json({ error: '아이디가 존재하지 않습니다' });
    }

    // 비밀번호 확인 (실제로는 bcrypt 등을 사용하여 비밀번호를 안전하게 확인해야 함)
    if (user.password !== password) {
      // 비밀번호가 일치하지 않음
      return res.status(401).json({ error: '비밀번호가 일치하지 않습니다' });
    }

    // 비밀번호가 일치하면 JWT 생성
    const token = jwt.sign({ userId: user.id, userType: user.type }, 'your-secret-key', { expiresIn: '1h' });

    // 사용자의 ID를 JSON으로 반환
    res.json({ userId: user.id, type: user.type, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 마이페이지 엔드포인트
signupRouter.get('/mypage', verifyToken, async (req, res) => {
  try {
    // req.userId를 사용하여 특정 사용자의 정보를 가져오는 쿼리를 작성
    const user = await db.oneOrNone('SELECT * FROM signup WHERE id = $1', [req.userId]);

    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
    }

    // 사용자 정보를 응답
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: '내부 서버 오류' });
  }
});

// JWT를 확인하는 미들웨어
function verifyToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: '인증되지 않음: 토큰이 제공되지 않았습니다' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: '인증되지 않음: 유효하지 않은 토큰' });
    }

    req.userId = decoded.userId; // 유저 ID를 요청 객체에 추가
    next();
  });
}

export default signupRouter;