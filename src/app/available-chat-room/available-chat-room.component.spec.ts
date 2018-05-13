import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableChatRoomComponent } from './available-chat-room.component';

describe('AvailableChatRoomComponent', () => {
  let component: AvailableChatRoomComponent;
  let fixture: ComponentFixture<AvailableChatRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvailableChatRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailableChatRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
