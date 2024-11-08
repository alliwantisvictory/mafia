import { Injectable } from '@nestjs/common';

// Token 인터페이스 정의
interface Token {
  key(): string;
  duration(): number;
}

// AccessToken 클래스
@Injectable()
export class AccessToken implements Token {
  constructor(
    private readonly channelId: string, // 채널 ID
    private readonly token: string, // 토큰 값
  ) {}

  key(): string {
    // AccessToken의 키 생성
    return `app-${process.env.APP_ID}-access-token-${this.channelId}`;
  }

  duration(): number {
    // 실제 지속 시간: 30분 - 1분
    return 30 * 60 * 1000 - 60 * 1000; // ms 단위 (TypeScript는 ms를 사용하므로 1000을 곱함)
  }
}

// RefreshToken 클래스
@Injectable()
export class RefreshToken implements Token {
  constructor(
    private readonly channelId: string, // 채널 ID
    private readonly token: string, // 토큰 값
  ) {}

  key(): string {
    // RefreshToken의 키 생성
    return `app-${process.env.APP_ID}-refresh-token-${this.channelId}`;
  }

  duration(): number {
    // 실제 지속 시간: 7일 - 1분
    return 7 * 24 * 60 * 60 * 1000 - 60 * 1000; // ms 단위
  }
}
