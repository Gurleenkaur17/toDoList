package com.jst.practice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/tasks")
public class controller {
    @Autowired
    private Repo repo;
    @GetMapping("/get")
    public List<Task> getAllTasks() {
        return repo.findAll();
    }
    @PostMapping("/post")
    public ResponseEntity<Object> createTask(@RequestBody Task task) {
        List<Task> existingTasks = repo.findByName(task.getName().trim());          
        if (!existingTasks.isEmpty()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Task with this name already exists");
        }
        else {
            Task savedTask = repo.save(task);
            return ResponseEntity.ok(savedTask);
        }
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateTask(@PathVariable Long id) {
        Optional<Task> task = repo.findById(id);
        if(task.isPresent()){
            Task task1 = task.get();
            task1.setCompleted(!task1.isCompleted());
            repo.save(task1);
        }
        return ResponseEntity.ok("Updated");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteTask(@PathVariable Long id) {
        repo.deleteById(id);
        return ResponseEntity.ok("Deleted");
    }
}
